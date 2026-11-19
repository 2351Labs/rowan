/**
 * In-memory dashboard filter session. Apps subscribe and apply values to
 * tables and charts. Hosts do not auto-subscribe. `snapshot()` is a shallow
 * copy for deep links; writing the URL stays the app's concern.
 *
 * @param {RowanDashboardFilterSnapshot} [initial]
 * @returns {RowanDashboardFilters}
 */
export function createDashboardFilters(
  initial?: Record<string, unknown> | undefined,
): RowanDashboardFilters;
/**
 * Write the shared crosshair category into a filter session.
 * Listens once on `document`, so charts inside shadow roots are included.
 * Repeated `rowan-sync` events for the same index update the session once.
 *
 * @param {RowanDashboardFilters} session
 * @param {string} group `sync-group` name.
 * @param {{ key?: string }} [options] Session key. Default `category`.
 * @returns {() => void} Removes the listener.
 */
export function bindChartSync(
  session: RowanDashboardFilters,
  group: string,
  options?:
    | {
        key?: string | undefined;
      }
    | undefined,
): () => void;
export type RowanDashboardFilterSnapshot = Record<string, unknown>;
export type RowanDashboardFilters = {
  get: (key: string) => unknown;
  set: (key: string, value: unknown) => void;
  clear: (key?: string) => void;
  replace: (snapshot: RowanDashboardFilterSnapshot) => void;
  subscribe: (listener: (snapshot: RowanDashboardFilterSnapshot) => void) => () => void;
  snapshot: () => RowanDashboardFilterSnapshot;
};
