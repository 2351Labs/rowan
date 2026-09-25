/**
 * Columns that should render or export. Pass `hiddenIds` to override
 * `column.hidden`; otherwise `column.hidden` is the source of truth.
 *
 * @param {Array<{ id?: string, hidden?: boolean } | null | undefined>} [columns]
 * @param {Iterable<string> | null} [hiddenIds]
 * @returns {object[]}
 */
export function visibleColumns(columns?: ({
    id?: string | undefined;
    hidden?: boolean | undefined;
} | null | undefined)[] | undefined, hiddenIds?: Iterable<string> | null | undefined): object[];
/**
 * RFC 4180 CSV text for table columns and rows. Hidden columns are omitted
 * unless `includeHidden` is true. The app owns download / Blob / URL writes.
 *
 * @param {object[]} [columns]
 * @param {object[]} [rows]
 * @param {{ includeHidden?: boolean }} [options]
 * @returns {string}
 */
export function createTableCsv(columns?: any[] | undefined, rows?: any[] | undefined, options?: {
    includeHidden?: boolean | undefined;
} | undefined): string;
