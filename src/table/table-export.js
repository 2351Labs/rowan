const FORMULA_START = /^[=+@\t\r-]/;
const NUMERIC_TEXT = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/;

/**
 * Prefix spreadsheet formulas so a text export cannot run as a formula.
 * Finite numbers, including negatives, are left alone.
 * @param {unknown} value
 * @param {boolean} enabled
 */
export function guardFormula(value, enabled) {
  const text = value == null ? "" : String(value);
  if (!enabled || text === "" || NUMERIC_TEXT.test(text)) return text;
  return FORMULA_START.test(text) ? `'${text}` : text;
}

/**
 * @param {string} value
 */
function csvCell(value) {
  if (/[",\r\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}

/**
 * @param {string[]} header
 * @param {string[][]} rows
 * @param {boolean} includeHeaders
 */
export function buildCsv(header, rows, includeHeaders) {
  const lines = [];
  if (includeHeaders) lines.push(header.map(csvCell).join(","));
  for (const row of rows) lines.push(row.map(csvCell).join(","));
  return `\uFEFF${lines.join("\r\n")}${lines.length ? "\r\n" : ""}`;
}

/**
 * @param {string[]} header
 * @param {string[][]} rows
 * @param {boolean} includeHeaders
 */
export function buildTsv(header, rows, includeHeaders) {
  const cell = (value) => value.replace(/[\t\r\n]/g, " ");
  const lines = [];
  if (includeHeaders) lines.push(header.map(cell).join("\t"));
  for (const row of rows) lines.push(row.map(cell).join("\t"));
  return lines.join("\n");
}

/**
 * @param {string} value
 */
function escapeHtml(value) {
  return value.replace(/[&<>"]/g, (char) => {
    if (char === "&") return "&amp;";
    if (char === "<") return "&lt;";
    if (char === ">") return "&gt;";
    return "&quot;";
  });
}

/**
 * @param {string[]} header
 * @param {string[][]} rows
 * @param {boolean} includeHeaders
 */
export function buildHtml(header, rows, includeHeaders) {
  const head = includeHeaders
    ? `<thead><tr>${header.map((cell) => `<th>${escapeHtml(cell)}</th>`).join("")}</tr></thead>`
    : "";
  const body = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
    .join("");
  return `<table>${head}<tbody>${body}</tbody></table>`;
}

/**
 * @param {unknown} cell
 */
function displayText(cell) {
  if (cell == null) return "";
  if (typeof cell === "string" || typeof cell === "number" || typeof cell === "boolean") {
    return String(cell);
  }
  return cell.text == null ? "" : String(cell.text);
}

function xmlText(value) {
  let text = "";
  for (const char of displayText(value)) {
    const code = char.charCodeAt(0);
    if (code <= 8 || code === 11 || code === 12 || (code >= 14 && code <= 31)) continue;
    text += char;
  }
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function columnLetter(index) {
  let n = index + 1;
  let name = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    name = String.fromCharCode(65 + rem) + name;
    n = Math.floor((n - 1) / 26);
  }
  return name;
}

function excelSerial(value) {
  const date = value instanceof Date ? value : new Date(value);
  const time = date.getTime();
  if (!Number.isFinite(time)) return null;
  const utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return String(Math.round((utc - Date.UTC(1899, 11, 30)) / 86400000));
}

/**
 * @param {{ value: unknown, text: string, type?: string }} cell
 * @param {boolean} formatValues
 */
function excelValue(cell, formatValues) {
  if (typeof cell !== "object" || cell == null || !("value" in cell)) {
    return { kind: "s", value: displayText(cell) };
  }
  if (!formatValues && (cell.type === "number" || typeof cell.value === "number")) {
    const numeric = Number(cell.value);
    if (Number.isFinite(numeric) && cell.value !== "") return { kind: "n", value: String(numeric) };
  }
  if (
    !formatValues &&
    (cell.type === "checkbox" || cell.type === "switch" || typeof cell.value === "boolean")
  ) {
    const checked = cell.value === true || cell.value === "true" || cell.value === 1;
    return { kind: "b", value: checked ? "1" : "0" };
  }
  if (!formatValues && (cell.type === "date" || cell.value instanceof Date)) {
    const serial = excelSerial(cell.value);
    if (serial != null) return { kind: "d", value: serial };
  }
  return { kind: "s", value: displayText(cell) };
}

function sheetCell(ref, kind, text, style) {
  const styleAttr = style ? ` s="${style}"` : "";
  if (kind === "n") return `<c r="${ref}"${styleAttr}><v>${text}</v></c>`;
  if (kind === "b") return `<c r="${ref}" t="b"${styleAttr}><v>${text}</v></c>`;
  if (kind === "d") return `<c r="${ref}" s="2"><v>${text}</v></c>`;
  return `<c r="${ref}" t="inlineStr"${styleAttr}><is><t xml:space="preserve">${xmlText(text)}</t></is></c>`;
}

/**
 * @param {string[]} header
 * @param {object[][]} rows
 * @param {{ includeHeaders: boolean, formatValues: boolean }} options
 */
export function buildXlsx(header, rows, options) {
  const matrix = [];
  if (options.includeHeaders) matrix.push(header.map((text) => ({ kind: "s", value: text, header: true })));
  for (const row of rows) {
    matrix.push(
      row.map((cell) => {
        const typed = excelValue(cell, options.formatValues);
        if (typed.kind === "s") typed.value = guardFormula(typed.value, options.guardFormulas !== false);
        return { ...typed, header: false };
      }),
    );
  }

  const widths = header.map((label, index) => {
    let width = String(label).length;
    for (const row of matrix) {
      const cell = row[index];
      if (!cell) continue;
      width = Math.max(width, String(cell.value).length);
    }
    return Math.min(40, Math.max(10, width + 2));
  });
  const cols = widths
    .map((width, index) => `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`)
    .join("");
  const sheetRows = matrix
    .map((row, rowIndex) => {
      const cells = row
        .map((cell, columnIndex) => {
          const style = cell.header ? "1" : "";
          return sheetCell(`${columnLetter(columnIndex)}${rowIndex + 1}`, cell.kind, cell.value, style);
        })
        .join("");
      return `<row r="${rowIndex + 1}">${cells}</row>`;
    })
    .join("");

  const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<cols>${cols}</cols>
<sheetData>${sheetRows}</sheetData>
</worksheet>`;

  const files = [
    {
      name: "[Content_Types].xml",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`,
    },
    {
      name: "_rels/.rels",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`,
    },
    {
      name: "xl/workbook.xml",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets>
</workbook>`,
    },
    {
      name: "xl/_rels/workbook.xml.rels",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`,
    },
    {
      name: "xl/styles.xml",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>
<fills count="1"><fill><patternFill patternType="none"/></fill></fills>
<borders count="1"><border/></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellStyleXfs>
<cellXfs count="3">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="14" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
</cellXfs>
</styleSheet>`,
    },
    { name: "xl/worksheets/sheet1.xml", data: sheet },
  ];

  return zipStore(files);
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function zipStore(files) {
  const encoder = new TextEncoder();
  const locals = [];
  const records = [];
  let offset = 0;

  for (const file of files) {
    const name = encoder.encode(file.name);
    const data = encoder.encode(file.data);
    const crc = crc32(data);
    const local = new Uint8Array(30 + name.length + data.length);
    const view = new DataView(local.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(8, 0, true);
    view.setUint32(14, crc, true);
    view.setUint32(18, data.length, true);
    view.setUint32(22, data.length, true);
    view.setUint16(26, name.length, true);
    local.set(name, 30);
    local.set(data, 30 + name.length);
    locals.push(local);
    records.push({ name, crc, size: data.length, offset });
    offset += local.length;
  }

  const centralStart = offset;
  const centrals = records.map((record) => {
    const header = new Uint8Array(46 + record.name.length);
    const view = new DataView(header.buffer);
    view.setUint32(0, 0x02014b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 20, true);
    view.setUint32(16, record.crc, true);
    view.setUint32(20, record.size, true);
    view.setUint32(24, record.size, true);
    view.setUint16(28, record.name.length, true);
    view.setUint32(42, record.offset, true);
    header.set(record.name, 46);
    offset += header.length;
    return header;
  });

  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, files.length, true);
  endView.setUint16(10, files.length, true);
  endView.setUint32(12, offset - centralStart, true);
  endView.setUint32(16, centralStart, true);

  const total = locals.reduce((sum, part) => sum + part.length, 0) + centrals.reduce((sum, part) => sum + part.length, 0) + end.length;
  const bytes = new Uint8Array(total);
  let cursor = 0;
  for (const part of [...locals, ...centrals, end]) {
    bytes.set(part, cursor);
    cursor += part.length;
  }
  return bytes;
}

/**
 * Read stored (uncompressed) ZIP members. Used by tests and by callers that want the worksheet XML.
 * @param {Uint8Array} bytes
 */
export function readStoredZip(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const files = new Map();
  let offset = 0;
  const decoder = new TextDecoder();
  while (offset + 30 <= bytes.length && view.getUint32(offset, true) === 0x04034b50) {
    const method = view.getUint16(offset + 8, true);
    const size = view.getUint32(offset + 18, true);
    const nameLength = view.getUint16(offset + 26, true);
    const extraLength = view.getUint16(offset + 28, true);
    const nameStart = offset + 30;
    const name = decoder.decode(bytes.subarray(nameStart, nameStart + nameLength));
    const dataStart = nameStart + nameLength + extraLength;
    if (method !== 0) throw new Error(`ZIP member ${name} is compressed`);
    files.set(name, decoder.decode(bytes.subarray(dataStart, dataStart + size)));
    offset = dataStart + size;
  }
  return files;
}

function guardedMatrix(header, rows, guard) {
  return {
    header: header.map((cell) => guardFormula(cell, guard)),
    rows: rows.map((row) => row.map((cell) => guardFormula(displayText(cell), guard))),
  };
}

async function writeClipboard(text, html) {
  if (navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
    const item = new ClipboardItem({
      "text/plain": new Blob([text], { type: "text/plain" }),
      "text/html": new Blob([html], { type: "text/html" }),
    });
    await navigator.clipboard.write([item]);
    return;
  }
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  throw new Error("Clipboard unavailable");
}

function download(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/**
 * @param {{ grid: Function, emit: Function, announce: Function, message: Function }} host
 * @param {object} [options]
 */
export async function copyTable(host, options = {}) {
  const grid = buildGrid(host, { ...options, purpose: "copy" });
  const guard = options.guardFormulas !== false;
  const plain = guardedMatrix(grid.header, grid.rows, guard);
  const detail = {
    text: buildTsv(plain.header, plain.rows, grid.includeHeaders),
    html: buildHtml(plain.header, plain.rows, grid.includeHeaders),
    header: plain.header,
    rows: plain.rows,
    columns: grid.columns,
    includeHeaders: grid.includeHeaders,
    scope: grid.scope,
  };
  const originalText = detail.text;
  const originalHtml = detail.html;
  if (!host.emit("rowan-copy", detail)) return { ...detail, copied: false, prevented: true };
  if (detail.text === originalText && detail.html === originalHtml) {
    const matrix = detail.rows.map((row) => row.map((cell) => guardFormula(displayText(cell), guard)));
    detail.text = buildTsv(detail.header, matrix, detail.includeHeaders);
    detail.html = buildHtml(detail.header, matrix, detail.includeHeaders);
  }
  if (!detail.text) {
    host.announce(host.message("nothingToCopy"));
    return { ...detail, copied: false };
  }
  try {
    await writeClipboard(detail.text, detail.html);
  } catch (error) {
    host.announce(host.message("copyFailed"));
    return { ...detail, copied: false, error };
  }
  const count = detail.rows.length;
  host.announce(
    count === 1 && detail.rows[0]?.length === 1 && grid.scope === "cell"
      ? host.message("copiedCell")
      : host.message("copiedRows", { count }),
  );
  return { ...detail, copied: true };
}

function pageSlice(entries, page) {
  if (!page) return entries;
  const size = Math.max(1, page.size || 1);
  const total = page.total ?? entries.length;
  const totalPages = Math.max(1, Math.ceil(total / size) || 1);
  const index = Math.min(Math.max(0, page.index || 0), totalPages - 1);
  const start = Math.min(index * size, entries.length);
  return entries.slice(start, Math.min(start + size, entries.length));
}

function buildGrid(host, options) {
  const purpose = options.purpose === "copy" ? "copy" : "export";
  const snap = host.snapshot(options.sourceRows);
  const provided = Array.isArray(options.sourceRows);
  const scope =
    options.scope ||
    (purpose === "copy" ? (snap.selected.length ? "selected" : "cell") : snap.server ? "page" : "all");
  let columns = snap.columns.filter((column) => !column.hidden);
  if (options.columns?.length) {
    const byId = new Map(snap.columns.map((column) => [column.id, column]));
    columns = options.columns.map((id) => byId.get(id)).filter(Boolean);
  } else if (scope === "cell" && !provided && snap.focus?.columnId) {
    columns = columns.filter((column) => column.id === snap.focus.columnId);
  }

  let entries = snap.entries;
  if (!provided) {
    if (scope === "cell") {
      entries = snap.focus ? entries.filter((entry) => entry.rowId === snap.focus.rowId).slice(0, 1) : [];
    } else if (scope === "selected") {
      const ids = new Set(snap.selected);
      entries = entries.filter((entry) => ids.has(entry.rowId));
    } else if (scope === "page" && !snap.server) {
      entries = pageSlice(entries, snap.page);
    }
  }

  const formatValues = options.formatValues !== false;
  const rows = entries.map((entry) => columns.map((column) => host.cell(entry, column, formatValues)));
  return {
    columns: columns.map((column) => ({ id: column.id, header: column.header, type: column.type })),
    header: columns.map((column) => column.header),
    rows,
    includeHeaders: options.includeHeaders ?? purpose !== "copy",
    scope: provided ? options.scope || "all" : scope,
    truncated: !provided && snap.server && scope === "all" && snap.total != null && snap.total > entries.length,
  };
}

async function sourceRows(options) {
  if (typeof options.getRows !== "function") return null;
  const result = await options.getRows();
  if (Array.isArray(result)) return result;
  return Array.isArray(result?.rows) ? result.rows : [];
}

/**
 * @param {{ grid: Function, emit: Function, announce: Function, message: Function }} host
 * @param {object} options
 * @param {"csv" | "xlsx"} format
 */
async function exportTable(host, options, format) {
  try {
    const provided = await sourceRows(options);
    const grid = buildGrid(host, { ...options, sourceRows: provided, purpose: "export" });
    if (!grid.columns.length) {
      host.announce(host.message("exportFailed"));
      return { exported: false, format };
    }
    const guard = options.guardFormulas !== false;
    const plain = guardedMatrix(grid.header, grid.rows, guard);
    const filename = options.filename || (format === "csv" ? "export.csv" : "export.xlsx");
    const detail = {
      format,
      filename,
      scope: grid.scope,
      includeHeaders: grid.includeHeaders,
      columns: grid.columns,
      header: plain.header,
      rows: plain.rows,
      cells: grid.rows,
      truncated: grid.truncated,
    };
    if (!host.emit("rowan-export", detail)) return { ...detail, exported: false, prevented: true };

    if (format === "csv") {
      const csv = buildCsv(detail.header, detail.rows.map((row) => row.map((cell) => guardFormula(displayText(cell), guard))), detail.includeHeaders);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      download(detail.filename, blob);
      host.announce(host.message("exportedFile", { filename: detail.filename }));
      return { ...detail, csv, blob, exported: true };
    }

    const formatValues = options.formatValues !== false;
    const xlsxRows = (detail.cells || []).map((row, rowIndex) =>
      row.map((cell, columnIndex) => {
        const edited = detail.rows?.[rowIndex]?.[columnIndex];
        if (displayText(edited) !== displayText(cell)) {
          return { text: displayText(edited), value: displayText(edited), type: "text" };
        }
        return cell;
      }),
    );
    const bytes = buildXlsx(detail.header, xlsxRows, {
      includeHeaders: detail.includeHeaders,
      formatValues,
      guardFormulas: guard,
    });
    const blob = new Blob([bytes], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    download(detail.filename, blob);
    host.announce(host.message("exportedFile", { filename: detail.filename }));
    return { ...detail, bytes, blob, exported: true };
  } catch (error) {
    host.announce(host.message("exportFailed"));
    return { exported: false, format, error };
  }
}

/**
 * @param {{ grid: Function, emit: Function, announce: Function, message: Function }} host
 * @param {object} [options]
 */
export function exportCsv(host, options = {}) {
  return exportTable(host, options, "csv");
}

/**
 * @param {{ grid: Function, emit: Function, announce: Function, message: Function }} host
 * @param {object} [options]
 */
export function exportExcel(host, options = {}) {
  return exportTable(host, options, "xlsx");
}
