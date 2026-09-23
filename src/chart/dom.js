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
 * @param {{
 *   x1: number,
 *   x2: number,
 *   y: number,
 *   tone?: string,
 *   label?: string,
 *   formattedValue?: string,
 * }} options
 */
export function createReferenceLine({
  x1,
  x2,
  y,
  tone = "neutral",
  label = "",
  formattedValue = "",
}) {
  const group = createSvgElement("g");
  group.setAttribute("class", "reference-line-group");
  group.dataset.refLine = "true";
  group.dataset.tone = tone;
  if (label) group.dataset.refLabel = label;
  group.dataset.refValue = formattedValue || String(y);

  const hit = createSvgElement("line");
  hit.setAttribute("class", "reference-line-hit");
  hit.setAttribute("x1", String(x1));
  hit.setAttribute("x2", String(x2));
  hit.setAttribute("y1", String(y));
  hit.setAttribute("y2", String(y));

  const line = createSvgElement("line");
  line.setAttribute("class", "reference-line");
  line.setAttribute("part", "reference-line");
  line.dataset.tone = tone;
  line.setAttribute("x1", String(x1));
  line.setAttribute("x2", String(x2));
  line.setAttribute("y1", String(y));
  line.setAttribute("y2", String(y));

  group.append(hit, line);
  return group;
}

export function emitPointActivate(host, emit, entry) {
  emit(host, "rowan-point-activate", {
    seriesId: entry.series.id,
    seriesLabel: entry.series.label,
    index: entry.index,
    label: entry.label,
    value: entry.value,
    formattedValue: entry.formattedValue,
  });
}

export function pointControlFor(container, key) {
  if (!container) return null;

  return (
    [...container.querySelectorAll("button[data-point-key]")].find(
      (button) => button.dataset.pointKey === key,
    ) ?? null
  );
}
