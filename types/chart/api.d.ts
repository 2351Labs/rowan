export function entryHidden(hidden: any, entry: any): boolean;
export function applySeriesVisibility(root: any, ids: any): void;
export function visibleEntries(host: any, entries: any): any;
export function prefersReducedMotion(): boolean;
/**
 * Arrow, Home, and End move across entries. Enter and Space activate.
 * @param {KeyboardEvent} event
 * @param {Array<{ key: string }>} entries
 * @param {(entry: { key: string }, activate: boolean) => void} onMove
 */
export function navigatePointKey(
  event: KeyboardEvent,
  entries: Array<{
    key: string;
  }>,
  onMove: (
    entry: {
      key: string;
    },
    activate: boolean,
  ) => void,
): void;
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
export function bindValueKeyboard(
  host: import("../lib/base-element.js").BaseElement,
  target: Element,
  {
    points,
    onActivate,
    live,
  }: {
    points: () => Array<{
      text: string;
      value?: number;
      index?: number;
    }>;
    onActivate?: (
      point: {
        text: string;
        value?: number;
        index?: number;
      },
      index: number,
    ) => void;
    live?: HTMLElement | null;
  },
): void;
import { readHiddenSeries } from "./hover.js";
import { writeHiddenSeries } from "./hover.js";
export { readHiddenSeries, writeHiddenSeries };
