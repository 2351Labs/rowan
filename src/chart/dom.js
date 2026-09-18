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
export function renderChartTable(table, { caption, labels, series, formatValue }) {
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
  table.replaceChildren(fragment);
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
