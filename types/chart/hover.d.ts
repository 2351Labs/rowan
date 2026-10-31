/**
 * @param {string[]} lines
 * @returns {string}
 */
export function formatHoverLines(lines: string[]): string;
export function createChartHoverBubble(): HTMLDivElement;
export function readHiddenSeries(host: any): string[];
export function writeHiddenSeries(host: any, value: any): void;
export function readTooltipFormatter(host: any): any;
export function writeTooltipFormatter(host: any, value: any): void;
export function hideChartHover(bubble: any): void;
export function showChartHover(bubble: any, text: any, clientX: any, clientY: any): void;
export function bindChartHover(
  element: any,
  {
    target,
    bubble,
    textForEvent,
  }: {
    target: any;
    bubble: any;
    textForEvent: any;
  },
): void;
export function hoverKeyFromEvent(event: any): string;
export function seriesHoverText(entries: any, event: any): string;
export function referenceLineHoverText(event: any, fallbackLabel?: string): string;
/**
 * @template {{ x: number }} T
 * @param {SVGSVGElement} svg
 * @param {T[]} points
 * @param {number} clientX
 * @returns {T | null}
 */
export function nearestPointByClientX<
  T extends {
    x: number;
  },
>(svg: SVGSVGElement, points: T[], clientX: number): T | null;
