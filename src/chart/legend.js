function hiddenIds(host) {
  return String(host.getAttribute("hidden-series") || "")
    .split(/[\s,]+/)
    .filter(Boolean);
}

function writeHidden(host, ids) {
  if (ids.length) host.setAttribute("hidden-series", ids.join(" "));
  else host.removeAttribute("hidden-series");
}

function legendIds(host, items) {
  const root = host.renderRoot;
  if (!root) return [];
  const marks = [...root.querySelectorAll("svg [data-point-key]")];
  const prefixes = [];
  const keys = [];
  for (const mark of marks) {
    const key = mark.dataset.pointKey || "";
    if (!keys.includes(key)) keys.push(key);
    const prefix = key.includes("::") ? key.slice(0, key.lastIndexOf("::")) : key;
    if (prefix && !prefixes.includes(prefix)) prefixes.push(prefix);
  }
  if (items.length === prefixes.length) return prefixes;
  if (items.length === keys.length) return keys;
  return items.map((item) => item.querySelector("[data-tone]")?.dataset.tone || "");
}

export function syncSeriesLegend(host, legend) {
  if (!legend) return;
  const items = [...legend.querySelectorAll(":scope > .legend-item, :scope > li")];
  const inferred = legendIds(host, items);
  items.forEach((item, index) => {
    if (!item.dataset.seriesId && inferred[index]) item.dataset.seriesId = inferred[index];
  });
  const hidden = new Set(hiddenIds(host));
  for (const item of items) {
    const id = item.dataset.seriesId;
    if (!id) continue;
    let button = item.querySelector(":scope > button.legend-button");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "legend-button";
      while (item.firstChild) button.append(item.firstChild);
      item.append(button);
    }
    button.dataset.seriesId = id;
    button.setAttribute("aria-pressed", hidden.has(id) ? "false" : "true");
  }
}

export function bindSeriesLegend(host, legend) {
  if (!legend || legend.dataset.bound) return;
  legend.dataset.bound = "true";
  const toggle = (id) => {
    if (!id) return;
    const current = hiddenIds(host);
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    const allowed = host.dispatchEvent(
      new CustomEvent("rowan-series-toggle", {
        detail: { seriesId: id, hiddenSeries: next },
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
    if (!allowed) return;
    writeHidden(host, next);
    syncSeriesLegend(host, legend);
  };
  legend.addEventListener("click", (event) => {
    const button = event.target instanceof Element ? event.target.closest("button.legend-button") : null;
    if (!button || !legend.contains(button)) return;
    toggle(button.dataset.seriesId || "");
  });
  legend.addEventListener("keydown", (event) => {
    const button = event.target instanceof Element ? event.target.closest("button.legend-button") : null;
    if (!button || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    toggle(button.dataset.seriesId || "");
  });
  const chartOf = () => host.renderRoot?.querySelector(".chart");
  legend.addEventListener("pointerover", (event) => {
    const button = event.target instanceof Element ? event.target.closest("button.legend-button") : null;
    const chart = chartOf();
    if (!chart) return;
    const id = button?.dataset.seriesId || "";
    chart.classList.toggle("is-legend-dim", Boolean(id));
    for (const el of host.renderRoot.querySelectorAll("[data-series-id],[data-point-key]")) {
      if (el.closest(".legend")) continue;
      const key = el.dataset.pointKey || "";
      el.classList.toggle("is-legend-hot", Boolean(id) && (el.dataset.seriesId === id || key === id || key.startsWith(`${id}::`)));
    }
  });
  legend.addEventListener("pointerout", () => {
    chartOf()?.classList.remove("is-legend-dim");
  });
  return toggle;
}
