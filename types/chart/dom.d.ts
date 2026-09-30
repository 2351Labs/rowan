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
 * @param {HTMLTableElement} table
 * @param {{
 *   caption: string,
 *   columns: Array<{ key: string, header: string }>,
 *   rows: Array<Record<string, string | null | undefined>>,
 * }} options
 */
export function renderKeyedChartTable(table: HTMLTableElement, { caption, columns, rows }: {
    caption: string;
    columns: Array<{
        key: string;
        header: string;
    }>;
    rows: Array<Record<string, string | null | undefined>>;
}): void;
/**
 * @param {HTMLTableElement} table
 * @param {{
 *   caption: string,
 *   rows: string[],
 *   columns: string[],
 *   values: Array<Array<number | null | undefined>>,
 *   formatValue: (value: number, rowIndex: number, columnIndex: number) => string,
 * }} options
 */
export function renderMatrixChartTable(table: HTMLTableElement, { caption, rows, columns, values, formatValue }: {
    caption: string;
    rows: string[];
    columns: string[];
    values: Array<Array<number | null | undefined>>;
    formatValue: (value: number, rowIndex: number, columnIndex: number) => string;
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
/**
 * Frozen hosts keep layout on `entry.x` / `entry.y`. Extra activate fields
 * (scatter x/y/size, heatmap row/column, waterfall type, range low/high,
 * box-plot min/q1/median/q3/max) belong on `entry.detail` so plot coordinates
 * are not copied into the event.
 */
export function emitPointActivate(host: any, emit: any, entry: any): void;
export function pointControlFor(container: any, key: any): any;
