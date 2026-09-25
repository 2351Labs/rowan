/**
 * Sort categories descending and build bar + cumulative-% series for
 * `rowan-combo-chart`. Nulls are omitted. The app assigns the result to
 * `labels` / `series`; the host does not auto-sort.
 *
 * @param {{
 *   values?: Array<number | null>,
 *   labels?: string[],
 *   bar?: { id?: string, label?: string },
 *   line?: { id?: string, label?: string },
 * }} [input]
 * @returns {{ labels: string[], series: object[] }}
 */
export function createParetoData(input?: {
    values?: (number | null)[] | undefined;
    labels?: string[] | undefined;
    bar?: {
        id?: string | undefined;
        label?: string | undefined;
    } | undefined;
    line?: {
        id?: string | undefined;
        label?: string | undefined;
    } | undefined;
} | undefined): {
    labels: string[];
    series: object[];
};
