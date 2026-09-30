const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

export function createSvgElement(name) {
  return document.createElementNS(SVG_NAMESPACE, name);
}

export function createCell(tagName, text, scope = "") {
  const cell = document.createElement(tagName);
  if (scope) cell.scope = scope;
  cell.textContent = text;
  return cell;
}

/**
 * @param {HTMLTableElement} table
 * @param {{
 *   caption: string,
 *   labels: string[],
 *   series: Array<{ label: string, values: Array<{ value: number | null }> }>,
 *   formatValue: (value: number, series: unknown, index: number, label: string) => string,
 * }} options
 */
export function renderChartTable(
  table,
  { caption, labels, series, formatValue, referenceLines = [] },
) {
  const fragment = document.createDocumentFragment();
  const captionEl = document.createElement("caption");
  captionEl.className = "sr-only";
  captionEl.textContent = caption;
  fragment.append(captionEl);

  const head = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headerRow.append(createCell("th", "Metric", "col"));
  for (const label of labels) {
    headerRow.append(createCell("th", label, "col"));
  }
  head.append(headerRow);
  fragment.append(head);

  const body = document.createElement("tbody");
  for (const item of series) {
    const row = document.createElement("tr");
    row.append(createCell("th", item.label, "row"));
    for (let index = 0; index < labels.length; index += 1) {
      const point = item.values[index];
      const text =
        point?.value === null || !point
          ? "No data"
          : formatValue(point.value, item, index, labels[index]);
      row.append(createCell("td", text));
    }
    body.append(row);
  }
  fragment.append(body);

  if (referenceLines.length) {
    const refs = document.createElement("tbody");
    refs.className = "reference-lines";
    const span = Math.max(1, labels.length);
    for (const line of referenceLines) {
      const row = document.createElement("tr");
      row.append(createCell("th", line.label || "Reference", "row"));
      const cell = document.createElement("td");
      cell.colSpan = span;
      cell.textContent = formatValue(
        line.value,
        { label: line.label || "Reference" },
        0,
        line.label,
      );
      row.append(cell);
      refs.append(row);
    }
    fragment.append(refs);
  }

  table.replaceChildren(fragment);
}

/**
 * @param {HTMLTableElement} table
 * @param {{
 *   caption: string,
 *   columns: Array<{ key: string, header: string }>,
 *   rows: Array<Record<string, string | null | undefined>>,
 * }} options
 */
export function renderKeyedChartTable(table, { caption, columns, rows }) {
  const fragment = document.createDocumentFragment();
  const captionEl = document.createElement("caption");
  captionEl.className = "sr-only";
  captionEl.textContent = caption;
  fragment.append(captionEl);

  const head = document.createElement("thead");
  const headerRow = document.createElement("tr");
  for (const column of columns) {
    headerRow.append(createCell("th", column.header, "col"));
  }
  head.append(headerRow);
  fragment.append(head);

  const body = document.createElement("tbody");
  for (const row of rows) {
    const tr = document.createElement("tr");
    for (const column of columns) {
      const value = row[column.key];
      tr.append(createCell("td", value == null || value === "" ? "No data" : String(value)));
    }
    body.append(tr);
  }
  fragment.append(body);
  table.replaceChildren(fragment);
}

/**
 * @param {HTMLTableElement} table
 * @param {{
 *   caption: string,
 *   rows: string[],
 *   columns: string[],
 *   values: Array<Array<number | null | undefined>>,
 *   formatValue: (value: number, rowIndex: number, columnIndex: number) => string,
 * }} options
 */
export function renderMatrixChartTable(table, { caption, rows, columns, values, formatValue }) {
  const fragment = document.createDocumentFragment();
  const captionEl = document.createElement("caption");
  captionEl.className = "sr-only";
  captionEl.textContent = caption;
  fragment.append(captionEl);

  const head = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headerRow.append(createCell("th", "", "col"));
  for (const column of columns) {
    headerRow.append(createCell("th", column, "col"));
  }
  head.append(headerRow);
  fragment.append(head);

  const body = document.createElement("tbody");
  rows.forEach((rowLabel, rowIndex) => {
    const tr = document.createElement("tr");
    tr.append(createCell("th", rowLabel, "row"));
    columns.forEach((_column, columnIndex) => {
      const value = values[rowIndex]?.[columnIndex];
      const text =
        value === null || value === undefined
          ? "No data"
          : formatValue(value, rowIndex, columnIndex);
      tr.append(createCell("td", text));
    });
    body.append(tr);
  });
  fragment.append(body);
  table.replaceChildren(fragment);
}

/**
 * Horizontal overlay: `x1`, `x2`, `y`. Vertical overlay: `x`, `y1`, `y2`.
 * @param {{
 *   x1?: number,
 *   x2?: number,
 *   y?: number,
 *   x?: number,
 *   y1?: number,
 *   y2?: number,
 *   tone?: string,
 *   label?: string,
 *   formattedValue?: string,
 * }} options
 */
export function createReferenceLine({
  x1,
  x2,
  y,
  x,
  y1,
  y2,
  tone = "neutral",
  label = "",
  formattedValue = "",
}) {
  const lineX1 = x ?? x1;
  const lineX2 = x ?? x2;
  const lineY1 = y1 ?? y;
  const lineY2 = y2 ?? y;
  const group = createSvgElement("g");
  group.setAttribute("class", "reference-line-group");
  group.dataset.refLine = "true";
  group.dataset.tone = tone;
  if (label) group.dataset.refLabel = label;
  group.dataset.refValue = formattedValue || String(y ?? x ?? "");

  const hit = createSvgElement("line");
  hit.setAttribute("class", "reference-line-hit");
  hit.setAttribute("x1", String(lineX1));
  hit.setAttribute("x2", String(lineX2));
  hit.setAttribute("y1", String(lineY1));
  hit.setAttribute("y2", String(lineY2));

  const line = createSvgElement("line");
  line.setAttribute("class", "reference-line");
  line.setAttribute("part", "reference-line");
  line.dataset.tone = tone;
  line.setAttribute("x1", String(lineX1));
  line.setAttribute("x2", String(lineX2));
  line.setAttribute("y1", String(lineY1));
  line.setAttribute("y2", String(lineY2));

  group.append(hit, line);
  return group;
}

/**
 * Frozen hosts keep layout on `entry.x` / `entry.y`. Extra activate fields
 * (scatter x/y/size, heatmap row/column, waterfall type, range low/high,
 * box-plot min/q1/median/q3/max) belong on `entry.detail` so plot coordinates
 * are not copied into the event.
 */
export function emitPointActivate(host, emit, entry) {
  const extra = entry.detail && typeof entry.detail === "object" ? entry.detail : {};
  const detail = {
    seriesId: entry.series?.id,
    seriesLabel: entry.series?.label,
    index: entry.index,
    label: entry.label,
    value: entry.value,
    formattedValue: entry.formattedValue,
  };
  for (const key of [
    "x",
    "y",
    "size",
    "row",
    "column",
    "rowIndex",
    "columnIndex",
    "type",
    "low",
    "high",
    "min",
    "q1",
    "median",
    "q3",
    "max",
  ]) {
    if (extra[key] !== undefined) detail[key] = extra[key];
  }
  emit(host, "rowan-point-activate", detail);
}

export function pointControlFor(container, key) {
  if (!container) return null;

  return (
    [...container.querySelectorAll("button[data-point-key]")].find(
      (button) => button.dataset.pointKey === key,
    ) ?? null
  );
}
