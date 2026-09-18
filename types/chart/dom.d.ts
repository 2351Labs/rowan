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
export function renderChartTable(table: HTMLTableElement, { caption, labels, series, formatValue }: {
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
export function emitPointActivate(host: any, emit: any, entry: any): void;
export function pointControlFor(container: any, key: any): any;
