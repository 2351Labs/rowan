export function createSvgElement(name: any): any;
export function createCell(tagName: any, text: any, scope?: string): any;
/**
 * @param {HTMLTableElement} table
 * @param {{
 *   caption: string,
 *   labels: string[],
 *   series: Array<{ label: string, values: Array<{ value: number | null }> }>,
 *   formatValue: (value: number, series: unknown, index: number, label: string) => string,
 * }} options
 */
export function renderChartTable(table: HTMLTableElement, { caption, labels, series, formatValue, referenceLines }: {
    caption: string;
    labels: string[];
    series: Array<{
        label: string;
        values: Array<{
            value: number | null;
        }>;
    }>;
    formatValue: (value: number, series: unknown, index: number, label: string) => string;
}): void;
/**
 * Horizontal overlay: `x1`, `x2`, `y`. Vertical overlay: `x`, `y1`, `y2`.
 * @param {{
 *   x1?: number,
 *   x2?: number,
 *   y?: number,
 *   x?: number,
 *   y1?: number,
 *   y2?: number,
 *   tone?: string,
 *   label?: string,
 *   formattedValue?: string,
 * }} options
 */
export function createReferenceLine({ x1, x2, y, x, y1, y2, tone, label, formattedValue, }: {
    x1?: number;
    x2?: number;
    y?: number;
    x?: number;
    y1?: number;
    y2?: number;
    tone?: string;
    label?: string;
    formattedValue?: string;
}): any;
export function emitPointActivate(host: any, emit: any, entry: any): void;
export function pointControlFor(container: any, key: any): any;
