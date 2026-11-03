/**
 * @typedef {object} RowanDashboardFilter
 * @property {string} [id]
 * @property {string} field
 * @property {string} [operator]
 * @property {unknown} [value]
 */
/**
 * @typedef {object} RowanDashboardFilterGroup
 * @property {string} [id]
 * @property {"and" | "or"} join
 * @property {Array<RowanDashboardFilter | RowanDashboardFilterGroup>} filters
 */
/**
 * @typedef {object} RowanDashboardChart
 * @property {HTMLElement} element
 * @property {string} field
 * @property {string | ((detail: Record<string, unknown>) => unknown)} [value]
 */
/**
 * @typedef {object} RowanDashboardControl
 * @property {HTMLElement} element
 * @property {string} field
 * @property {string} [event]
 * @property {(event: Event) => unknown} [read]
 * @property {(value: unknown) => void} [write]
 */
/**
 * @typedef {object} RowanDashboardUrlWindow
 * @property {{ href: string }} location
 * @property {{
 *   pushState: (state: unknown, title: string, url?: string | null) => void,
 *   replaceState: (state: unknown, title: string, url?: string | null) => void,
 * }} history
 * @property {(type: string, listener: EventListener) => void} addEventListener
 * @property {(type: string, listener: EventListener) => void} removeEventListener
 */
/**
 * @typedef {object} RowanDashboardUrlOptions
 * @property {string} [param] Query key. Default `df`.
 * @property {"push" | "replace"} [history] History mode for user changes. Default `push`. Loading uses replace.
 * @property {RowanDashboardUrlWindow} [window]
 */
/**
 * @typedef {object} RowanDashboardMessages
 * @property {string | ((context: { field: string, operator: string, value: string }) => string)} [chip]
 * @property {string} [chipsLabel]
 * @property {string} [clear]
 * @property {string} [groupAnd]
 * @property {string} [groupOr]
 * @property {string} [remove]
 */
/**
 * @typedef {object} RowanDashboardOptions
 * @property {HTMLElement} [root] Receives `rowan-dashboard-change` and `rowan-dashboard-clear`. Chips are prepended here.
 * @property {HTMLElement | Array<RowanDashboardFilter | RowanDashboardFilterGroup>} [filters] A filter builder, or the initial tree. Builders inside `root` are used when this is omitted.
 * @property {RowanDashboardControl[]} [controls] Equals controls. `[data-dashboard-field]` inside `root` is used when this is omitted.
 * @property {boolean | RowanDashboardUrlOptions} [url] Share the tree in the query string. Back and forward restore it.
 * @property {Array<HTMLElement | RowanDashboardChart>} [charts] Point, slice, and bar clicks toggle an equals filter. Charts inside `root` with `data-dashboard-field` are used when this is omitted.
 * @property {HTMLElement | null} [table] Client mode filters `rows`. Server mode writes `filters` and keeps quick `{ id, value }` filters.
 * @property {Array<{ id: string, label?: string, type?: string, options?: Array<string | { value?: string, label?: string }> }>} [fields]
 * @property {Array<Record<string, unknown>>} [rows] Client source rows. Defaults to the table rows at creation.
 * @property {boolean | HTMLElement} [chips] Active-filter chips. Defaults to true when `root` is set.
 * @property {RowanDashboardMessages} [messages]
 */
/**
 * @typedef {object} RowanDashboard
 * @property {(field: string) => unknown} get
 * @property {(field: string, value: unknown) => void} set
 * @property {(field: string, value: unknown) => void} toggle
 * @property {(field?: string) => void} clear
 * @property {(filters: Array<RowanDashboardFilter | RowanDashboardFilterGroup> | null | undefined) => void} replace
 * @property {() => Array<RowanDashboardFilter | RowanDashboardFilterGroup>} snapshot
 * @property {() => string} search
 * @property {(listener: (filters: Array<RowanDashboardFilter | RowanDashboardFilterGroup>) => void) => () => void} subscribe
 * @property {(rows: Array<Record<string, unknown>> | null | undefined) => void} setRows
 * @property {() => void} destroy
 */
/**
 * One filter tree for a dashboard.
 *
 * The tree stays in sync with a filter builder, field controls, chart
 * point/slice/bar clicks, the query string, active-filter chips, and one
 * `rowan-table`. Client tables get filtered rows. `data-mode="server"` sends
 * the tree to `getRows`. Chart series stay on the host.
 *
 * Load it from `@rowan-ui/core/dashboard`. This module does not import chart
 * or table implementations.
 *
 * `rowan-dashboard-change` fires on `root` with `{ filters, source }`.
 * `source` is `api`, `chart`, `control`, `filter`, `chip`, `url`, or `clear`.
 * `rowan-dashboard-clear` fires as well when the tree becomes empty.
 * Clicks toggle: the same point again clears that field. Point buttons stay
 * the chart's keyboard controls.
 *
 * @param {RowanDashboardOptions} [options]
 * @returns {RowanDashboard}
 */
export function createDashboard(options?: RowanDashboardOptions | undefined): RowanDashboard;
export type RowanDashboardFilter = {
  id?: string | undefined;
  field: string;
  operator?: string | undefined;
  value?: unknown;
};
export type RowanDashboardFilterGroup = {
  id?: string | undefined;
  join: "and" | "or";
  filters: Array<RowanDashboardFilter | RowanDashboardFilterGroup>;
};
export type RowanDashboardChart = {
  element: HTMLElement;
  field: string;
  value?: string | ((detail: Record<string, unknown>) => unknown) | undefined;
};
export type RowanDashboardControl = {
  element: HTMLElement;
  field: string;
  event?: string | undefined;
  read?: ((event: Event) => unknown) | undefined;
  write?: ((value: unknown) => void) | undefined;
};
export type RowanDashboardUrlWindow = {
  location: {
    href: string;
  };
  history: {
    pushState: (state: unknown, title: string, url?: string | null) => void;
    replaceState: (state: unknown, title: string, url?: string | null) => void;
  };
  addEventListener: (type: string, listener: EventListener) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
};
export type RowanDashboardUrlOptions = {
  /**
   * Query key. Default `df`.
   */
  param?: string | undefined;
  /**
   * History mode for user changes. Default `push`. Loading uses replace.
   */
  history?: "push" | "replace" | undefined;
  window?: RowanDashboardUrlWindow | undefined;
};
export type RowanDashboardMessages = {
  chip?:
    string | ((context: { field: string; operator: string; value: string }) => string) | undefined;
  chipsLabel?: string | undefined;
  clear?: string | undefined;
  groupAnd?: string | undefined;
  groupOr?: string | undefined;
  remove?: string | undefined;
};
export type RowanDashboardOptions = {
  /**
   * Receives `rowan-dashboard-change` and `rowan-dashboard-clear`. Chips are prepended here.
   */
  root?: HTMLElement | undefined;
  /**
   * A filter builder, or the initial tree. Builders inside `root` are used when this is omitted.
   */
  filters?: HTMLElement | (RowanDashboardFilter | RowanDashboardFilterGroup)[] | undefined;
  /**
   * Equals controls. `[data-dashboard-field]` inside `root` is used when this is omitted.
   */
  controls?: RowanDashboardControl[] | undefined;
  /**
   * Share the tree in the query string. Back and forward restore it.
   */
  url?: boolean | RowanDashboardUrlOptions | undefined;
  /**
   * Point, slice, and bar clicks toggle an equals filter. Charts inside `root` with `data-dashboard-field` are used when this is omitted.
   */
  charts?: (HTMLElement | RowanDashboardChart)[] | undefined;
  /**
   * Client mode filters `rows`. Server mode writes `filters` and keeps quick `{ id, value }` filters.
   */
  table?: HTMLElement | null | undefined;
  fields?:
    | {
        id: string;
        label?: string | undefined;
        type?: string | undefined;
        options?:
          | (
              | string
              | {
                  value?: string | undefined;
                  label?: string | undefined;
                }
            )[]
          | undefined;
      }[]
    | undefined;
  /**
   * Client source rows. Defaults to the table rows at creation.
   */
  rows?: Record<string, unknown>[] | undefined;
  /**
   * Active-filter chips. Defaults to true when `root` is set.
   */
  chips?: boolean | HTMLElement | undefined;
  messages?: RowanDashboardMessages | undefined;
};
export type RowanDashboard = {
  get: (field: string) => unknown;
  set: (field: string, value: unknown) => void;
  toggle: (field: string, value: unknown) => void;
  clear: (field?: string) => void;
  replace: (
    filters: Array<RowanDashboardFilter | RowanDashboardFilterGroup> | null | undefined,
  ) => void;
  snapshot: () => Array<RowanDashboardFilter | RowanDashboardFilterGroup>;
  search: () => string;
  subscribe: (
    listener: (filters: Array<RowanDashboardFilter | RowanDashboardFilterGroup>) => void,
  ) => () => void;
  setRows: (rows: Array<Record<string, unknown>> | null | undefined) => void;
  destroy: () => void;
};
