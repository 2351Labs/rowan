export function withVibrantChartPalette(node) {
  const wrap = document.createElement("div");
  wrap.dataset.rowanCharts = "vibrant";
  wrap.append(node);
  return wrap;
}
