/** Shared chart interaction state: hidden series and keyboard movement. */

import { readHiddenSeries, writeHiddenSeries } from "./hover.js";

export { readHiddenSeries, writeHiddenSeries };

function idHidden(hidden, id, key, tone) {
  if (id && hidden.has(id)) return true;
  if (tone && hidden.has(tone)) return true;
  if (key && hidden.has(key)) return true;
  for (const item of hidden) if (key && key.startsWith(`${item}::`)) return true;
  return false;
}

export function entryHidden(hidden, entry) {
  return idHidden(hidden, entry?.series?.id || "", entry?.key || "", entry?.tone || "");
}

function elementHidden(hidden, el) {
  return idHidden(hidden, el.dataset.seriesId || "", el.dataset.pointKey || "", el.dataset.tone || "");
}

export function applySeriesVisibility(root, ids) {
  if (!root) return;
  const host = root.parentNode.host;
  if (host && !host.__z) {
    const queued = [];
    const remember = (event) => queued.push(event);
    host.addEventListener("wheel", remember);
    host.__z = import("./ix.js").then((m) => {
      host.removeEventListener("wheel", remember);
      return m.run(host, queued.concat(host.__e || []));
    });
  }
  const hidden = new Set(ids);
  for (const el of root.querySelectorAll("[data-series-id],[data-point-key]")) {
    if (el.closest(".legend")) continue;
    const hide = elementHidden(hidden, el);
    el.classList.toggle("is-series-hidden", hide);
    if (el instanceof HTMLButtonElement) el.hidden = hide;
  }
}

export function visibleEntries(host, entries) {
  const hidden = new Set(readHiddenSeries(host));
  if (!hidden.size) return entries;
  return entries.filter((entry) => !entryHidden(hidden, entry));
}

export function prefersReducedMotion() {
  return (
    typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Arrow, Home, and End move across entries. Enter and Space activate.
 * @param {KeyboardEvent} event
 * @param {Array<{ key: string }>} entries
 * @param {(entry: { key: string }, activate: boolean) => void} onMove
 */
export function navigatePointKey(event, entries, onMove) {
  const button = event.target instanceof Element ? event.target.closest("button[data-point-key]") : null;
  if (!button) return;
  const index = entries.findIndex((entry) => entry.key === button.dataset.pointKey);
  if (index < 0) return;
  const key = event.key;
  if (key === "Enter" || key === " ") {
    event.preventDefault();
    onMove(entries[index], true);
    return;
  }
  const last = entries.length - 1;
  const step =
    key === "Home" ? 0 : key === "End" ? last : key === "ArrowRight" || key === "ArrowDown" ? (index + 1) % entries.length : key === "ArrowLeft" || key === "ArrowUp" ? (index + last) % entries.length : -1;
  if (step < 0 || step === index) return;
  event.preventDefault();
  onMove(entries[step], false);
}

/**
 * Keyboard across a single series of values (sparklines, bullet, gauge).
 * @param {import("../lib/base-element.js").BaseElement} host
 * @param {Element} target
 * @param {{
 *   points: () => Array<{ text: string, value?: number, index?: number }>,
 *   onActivate?: (point: { text: string, value?: number, index?: number }, index: number) => void,
 *   live?: HTMLElement | null,
 * }} options
 */
export function bindValueKeyboard(host, target, { points, onActivate, live }) {
  if (!target || target.dataset.valueKeys) return;
  target.dataset.valueKeys = "true";
  target.tabIndex = 0;
  target.setAttribute("role", "group");
  let index = 0;
  const list = () => points().filter((point) => point && point.text);
  const announce = () => {
    const items = list();
    if (!live) return;
    if (!items.length) {
      live.hidden = true;
      live.textContent = "";
      return;
    }
    index = Math.min(Math.max(index, 0), items.length - 1);
    live.hidden = false;
    live.textContent = items[index].text;
  };
  host.listen(target, "focusin", announce);
  host.listen(target, "keydown", (event) => {
    const items = list();
    if (!items.length) return;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      index = (index + 1) % items.length;
      announce();
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      index = (index - 1 + items.length) % items.length;
      announce();
    } else if (event.key === "Home") {
      event.preventDefault();
      index = 0;
      announce();
    } else if (event.key === "End") {
      event.preventDefault();
      index = items.length - 1;
      announce();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onActivate?.(items[index], index);
    }
  });
}
