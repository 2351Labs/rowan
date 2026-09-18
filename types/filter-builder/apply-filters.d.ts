/**
 * Applies a frozen flat AND filter list to rows. Unknown operators do not match.
 * @param {object[]} rows
 * @param {Array<{ field: string, operator: string, value?: unknown }>} filters
 * @param {Array<{ id: string, type?: string, accessor?: string | ((row: object) => unknown) }>} [fields]
 * @returns {object[]}
 */
export function applyFilters(rows: object[], filters: Array<{
    field: string;
    operator: string;
    value?: unknown;
}>, fields?: {
    id: string;
    type?: string | undefined;
    accessor?: string | ((row: object) => unknown) | undefined;
}[] | undefined): object[];
