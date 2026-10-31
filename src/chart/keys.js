const NAMES = new Set(["rowan-sparkline", "rowan-bullet-chart"]);

function rowsOf(host) {
  return [...host.renderRoot.querySelectorAll("table tbody tr")]
    .map((row) => ({
      label: row.cells[0]?.textContent || "",
      value: row.cells[1]?.textContent || "",
    }))
    .filter((row) => row.label);
}

export function install(host) {
  if (!NAMES.has(host?.localName) || host.__keys) return;
  const plot = host.renderRoot?.querySelector("svg.plot");
  if (!plot) return;
  host.__keys = 1;
  plot.tabIndex = 0;
  plot.setAttribute("role", "group");
  if (!plot.getAttribute("aria-label")) plot.setAttribute("aria-label", host.getAttribute("label") || "Chart");
  let live = host.renderRoot.querySelector("output.detail");
  if (!live) {
    live = document.createElement("output");
    live.className = "detail sr-only";
    live.setAttribute("part", "detail");
    live.setAttribute("aria-live", "polite");
    host.renderRoot.querySelector(".chart")?.append(live);
  }
  let index = 0;
  const announce = () => {
    const items = rowsOf(host);
    if (!items.length) return;
    index = Math.min(Math.max(index, 0), items.length - 1);
    live.textContent = `${items[index].label}: ${items[index].value}`;
  };
  plot.addEventListener("focus", announce);
  plot.addEventListener("keydown", (event) => {
    const items = rowsOf(host);
    if (!items.length) return;
    const key = event.key;
    if (key === "ArrowRight" || key === "ArrowDown") index = (index + 1) % items.length;
    else if (key === "ArrowLeft" || key === "ArrowUp") index = (index - 1 + items.length) % items.length;
    else if (key === "Home") index = 0;
    else if (key === "End") index = items.length - 1;
    else if (key === "Enter" || key === " ") {
      event.preventDefault();
      host.dispatchEvent(
        new CustomEvent("rowan-point-activate", {
          bubbles: true,
          composed: true,
          detail: { index, label: items[index].label, value: items[index].value },
        }),
      );
      announce();
      return;
    } else return;
    event.preventDefault();
    announce();
  });
}
