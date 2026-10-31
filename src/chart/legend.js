import { emit } from "../lib/events.js";
import { readHiddenSeries, writeHiddenSeries } from "./api.js";

export function syncSeriesLegend(host, legend, ids) {
  if (!legend) return;
  const hidden = new Set(readHiddenSeries(host));
  [...legend.children].forEach((item, index) => {
    if (item.localName !== "li") return;
    const id = String(ids[index] ?? "");
    if (!id) return;
    let button = item.querySelector("button");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "legend-button";
      while (item.firstChild) button.append(item.firstChild);
      item.append(button);
    }
    button.dataset.seriesId = id;
    button.setAttribute("aria-pressed", hidden.has(id) ? "false" : "true");
  });
}

export function bindSeriesLegend(host, legend) {
  if (!legend || legend.dataset.bound) return;
  legend.dataset.bound = "true";
  host.listen(legend, "click", (event) => {
    const button = event.target instanceof Element ? event.target.closest("button") : null;
    const id = button?.dataset.seriesId;
    if (!id || !legend.contains(button)) return;
    const current = readHiddenSeries(host);
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    if (emit(host, "rowan-series-toggle", { seriesId: id, hiddenSeries: next }, { cancelable: true }) === false) {
      return;
    }
    writeHiddenSeries(host, next);
  });
}
