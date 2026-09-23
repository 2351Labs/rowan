/**
 * @param {string[]} lines
 * @returns {string}
 */
export function formatHoverLines(lines: string[]): string;
export function ensureChartHoverStyles(root: any): void;
export function createChartHoverBubble(): HTMLDivElement;
export function hideChartHover(bubble: any): void;
export function showChartHover(bubble: any, text: any, event: any, anchor: any): void;
/**
 * @param {import("../lib/base-element.js").BaseElement} element
 * @param {{
 *   target: EventTarget,
 *   bubble: HTMLElement,
 *   textForEvent: (event: PointerEvent) => string,
 *   anchor?: Element,
 * }} options
 */
export function bindChartHover(element: import("../lib/base-element.js").BaseElement, { target, bubble, textForEvent, anchor }: {
    target: EventTarget;
    bubble: HTMLElement;
    textForEvent: (event: PointerEvent) => string;
    anchor?: Element;
}): void;
export function hoverKeyFromEvent(event: any): string;
export function seriesHoverText(entries: any, event: any): string;
/**
 * @template {{ x: number }} T
 * @param {SVGSVGElement} svg
 * @param {T[]} points
 * @param {number} clientX
 * @returns {T | null}
 */
export function nearestPointByClientX<T extends {
    x: number;
}>(svg: SVGSVGElement, points: T[], clientX: number): T | null;
