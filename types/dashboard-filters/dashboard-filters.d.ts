/**
 * In-memory dashboard filter session. Apps subscribe and apply values to
 * tables and charts. Hosts do not auto-subscribe. `snapshot()` is a shallow
 * copy for deep links; writing the URL stays the app's concern.
 *
 * @param {RowanDashboardFilterSnapshot} [initial]
 * @returns {RowanDashboardFilters}
 */
export function createDashboardFilters(initial?: Record<string, unknown> | undefined): RowanDashboardFilters;
export type RowanDashboardFilterSnapshot = Record<string, unknown>;
export type RowanDashboardFilters = {
    get: (key: string) => unknown;
    set: (key: string, value: unknown) => void;
    clear: (key?: string) => void;
    replace: (snapshot: RowanDashboardFilterSnapshot) => void;
    subscribe: (listener: (snapshot: RowanDashboardFilterSnapshot) => void) => () => void;
    snapshot: () => RowanDashboardFilterSnapshot;
};
