const widths = new WeakMap();

function mapFor(table) {
  let map = widths.get(table);
  if (!map) {
    map = new Map();
    widths.set(table, map);
  }
  return map;
}

export function setColumnWidth(table, columnId, width) {
  const map = mapFor(table);
  if (width == null || width === "") map.delete(columnId);
  else map.set(columnId, width);
}

export function columnWidth(table, columnId) {
  return widths.get(table)?.get(columnId);
}

export function clearColumnWidths(table) {
  widths.delete(table);
}
