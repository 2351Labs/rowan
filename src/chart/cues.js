/** Lazy series cues and one tab stop for point buttons. Not part of the initial chart graph. */

const DASH = ["none", "6 4", "2 2", "8 3 2 3", "1 2"];
const FORCED = ["CanvasText", "Highlight", "LinkText", "GrayText"];

function grouper(marks) {
  const bands = new Set(marks.map((el) => el.dataset.band).filter(Boolean));
  if (bands.size > 1) return (el) => el.dataset.band || "mark";
  const prefixes = new Set();
  for (const el of marks) {
    const key = el.dataset.pointKey || "";
    if (key.includes("::")) prefixes.add(key.slice(0, key.lastIndexOf("::")));
  }
  if (prefixes.size > 1) {
    return (el) => {
      const key = el.dataset.pointKey || "";
      return key.includes("::") ? key.slice(0, key.lastIndexOf("::")) : el.dataset.seriesId || "mark";
    };
  }
  const tones = new Set(marks.map((el) => el.dataset.tone).filter(Boolean));
  if (tones.size > 1) return (el) => el.dataset.tone || el.dataset.pointKey || "mark";
  return (el) => el.dataset.pointKey || el.dataset.seriesId || el.dataset.tone || "mark";
}

function rove(root) {
  const buttons = [...root.querySelectorAll("button[data-point-key]")].filter(
    (button) => !button.hidden && !button.disabled,
  );
  if (buttons.length < 2) return;
  const active = root.activeElement;
  const current = buttons.includes(active) ? active : buttons.find((button) => button.tabIndex === 0) || buttons[0];
  for (const button of buttons) button.tabIndex = button === current ? 0 : -1;
  if (root.dataset.cuesRove) return;
  root.dataset.cuesRove = "true";
  root.addEventListener("focusin", (event) => {
    const button = event.target instanceof Element ? event.target.closest("button[data-point-key]") : null;
    if (!button || button.hidden || button.disabled) return;
    for (const item of root.querySelectorAll("button[data-point-key]")) {
      if (!item.hidden && !item.disabled) item.tabIndex = item === button ? 0 : -1;
    }
  });
}

function paint(el, index, forced) {
  const dash = DASH[index % DASH.length];
  if (index > 0 && dash !== "none") {
    el.setAttribute("stroke-dasharray", dash);
    const style = getComputedStyle(el);
    if (style.stroke === "none") {
      const fill = style.fill && style.fill !== "none" ? style.fill : "currentColor";
      el.setAttribute("stroke", fill);
      if (!el.getAttribute("stroke-width")) el.setAttribute("stroke-width", "2");
    }
  }
  if (forced) {
    const color = FORCED[index % FORCED.length];
    el.style.setProperty("fill", color);
    el.style.setProperty("stroke", color);
  }
  el.dataset.cue = String(index);
}

export function applySeriesCues(host) {
  const root = host?.renderRoot;
  if (!root) return;
  rove(root);
  if (host.getAttribute("cues") === "off") return;
  const svg = root.querySelector("svg.plot");
  if (!svg) return;
  const marks = [...svg.querySelectorAll("[data-point-key], [data-series-id], [data-tone], [data-band]")].filter(
    (el) => el.localName !== "text" && !el.closest("defs, .legend"),
  );
  if (marks.length < 2) return;
  const idOf = grouper(marks);
  const order = [];
  for (const el of marks) {
    const id = idOf(el);
    if (!order.includes(id)) order.push(id);
  }
  if (order.length < 2) return;
  const forced = typeof matchMedia === "function" && matchMedia("(forced-colors: active)").matches;
  for (const el of marks) paint(el, order.indexOf(idOf(el)), forced);
}
