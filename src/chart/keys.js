const NAMES = new Set(["rowan-sparkline", "rowan-bullet-chart"]);

function rowsOf(host) {
  return [...host.renderRoot.querySelectorAll("table tbody tr")]
    .map((row) => ({
      label: row.cells[0]?.textContent || "",
      value: row.cells[1]?.textContent || "",
    }))
    .filter((row) => row.label);
}

function valueList(host) {
  const list = host.__seriesRef;
  if (!Array.isArray(list) || list.length <= 80) return null;
  if (typeof list[0] === "number" || list[0] == null) return list;
  return null;
}

function countOf(host) {
  return valueList(host)?.length || rowsOf(host).length;
}

function textAt(host, index) {
  const list = valueList(host);
  if (list) {
    const value = list[index];
    const messages = host.messages || {};
    const point = messages.point;
    const indexText = String(index + 1);
    const label =
      host.__labelsRef?.[index] ||
      (typeof point === "function"
        ? String(point({ index: indexText }))
        : typeof point === "string" && point
          ? point.replaceAll("{index}", indexText)
          : `Point ${indexText}`);
    let shown = "No data";
    if (value != null) {
      try {
        shown = new Intl.NumberFormat(host.locale || undefined).format(value);
      } catch {
        shown = String(value);
      }
    } else if (typeof messages.noData === "string" && messages.noData) {
      shown = messages.noData;
    }
    return { label, value: shown };
  }
  return rowsOf(host)[index] || { label: "", value: "" };
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
    const count = countOf(host);
    if (!count) return;
    index = Math.min(Math.max(index, 0), count - 1);
    const item = textAt(host, index);
    live.textContent = `${item.label}: ${item.value}`;
  };
  plot.addEventListener("focus", announce);
  plot.addEventListener("keydown", (event) => {
    const count = countOf(host);
    if (!count) return;
    const key = event.key;
    if (key === "ArrowRight" || key === "ArrowDown") index = (index + 1) % count;
    else if (key === "ArrowLeft" || key === "ArrowUp") index = (index - 1 + count) % count;
    else if (key === "Home") index = 0;
    else if (key === "End") index = count - 1;
    else if (key === "Enter" || key === " ") {
      event.preventDefault();
      const item = textAt(host, index);
      host.dispatchEvent(
        new CustomEvent("rowan-point-activate", {
          bubbles: true,
          composed: true,
          detail: { index, label: item.label, value: item.value },
        }),
      );
      announce();
      return;
    } else return;
    event.preventDefault();
    announce();
  });
}
