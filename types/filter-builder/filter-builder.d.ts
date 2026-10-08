/**
 * Configurable filter editor that composes with a Rowan data table.
 * @tag rowan-filter-builder
 * @attr {string} for-table
 * @attr {string} label
 * @attr {string} add-label
 * @attr {string} clear-label
 * @attr {boolean} disabled
 * @slot actions - Controls displayed beside the filter actions
 * @csspart builder
 * @csspart header
 * @csspart filters
 * @csspart filter
 * @csspart field-select
 * @csspart operator-select
 * @csspart value-control
 * @csspart add-button
 * @csspart add-group-button
 * @csspart clear-button
 * @csspart group
 * @cssprop --rowan-filter-builder-bg
 * @cssprop --rowan-filter-builder-border
 * @cssprop --rowan-filter-builder-control-bg
 * @property {RowanFilterField[]} fields - Filterable fields. Arrays are property-only.
 * @property {Array<RowanFilter | RowanFilterGroup>} filters - Top-level AND list of frozen leaves. Group nodes are experimental. Arrays are property-only.
 * @property {RowanFilterBuilderMessages} messages - Property-only built-in message overrides.
 * @event rowan-filter-change - Fired when the user adds, updates, removes, or clears a filter
 */
export class RowanFilterBuilder extends BaseElement {
  static shadowRootOptions: {
    mode: string;
    delegatesFocus: boolean;
  };
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
  set table(value: null);
  get table(): null;
  set forTable(value: string);
  get forTable(): string;
  /** @param {RowanFilterField[]} value */
  set fields(value: RowanFilterField[]);
  /** @returns {RowanFilterField[]} */
  get fields(): RowanFilterField[];
  /** @param {Array<RowanFilter | RowanFilterGroup>} value */
  set filters(value: (RowanFilter | RowanFilterGroup)[]);
  /** @returns {Array<RowanFilter | RowanFilterGroup>} */
  get filters(): (RowanFilter | RowanFilterGroup)[];
  set label(value: string);
  get label(): string;
  set addLabel(value: string);
  get addLabel(): string;
  set clearLabel(value: string);
  get clearLabel(): string;
  set disabled(value: boolean);
  get disabled(): boolean;
  /** @param {RowanFilterBuilderMessages | null | undefined} value */
  set messages(value: RowanFilterBuilderMessages | null | undefined);
  /** @returns {RowanFilterBuilderMessages} */
  get messages(): RowanFilterBuilderMessages;
  addFilter(value?: {}): any;
  removeFilter(id: any): boolean;
  clearFilters(): boolean;
  refresh(): void;
  #private;
}
export type RowanFilterBuilderMessages = {
  addGroupLabel?: string | undefined;
  addInGroupLabel?: string | undefined;
  addLabel?: string | undefined;
  booleanFalse?: string | undefined;
  booleanTrue?: string | undefined;
  chooseValue?: string | undefined;
  clearLabel?: string | undefined;
  empty?: string | undefined;
  fieldLabel?: string | undefined;
  groupJoinAnd?: string | undefined;
  groupJoinOr?: string | undefined;
  groupJoinLabel?: string | undefined;
  label?: string | undefined;
  noValue?: string | undefined;
  operatorLabel?: string | ((context: { label: string; operator: string }) => string) | undefined;
  operatorSelectLabel?: string | undefined;
  remove?: string | undefined;
  removeFilter?: string | ((context: { field: string }) => string) | undefined;
  removeGroup?: string | undefined;
  unknownField?: string | ((context: { field: string }) => string) | undefined;
  value?: string | undefined;
  valueFor?: string | ((context: { label: string }) => string) | undefined;
};
export type RowanFilterFieldType = "text" | "number" | "date" | "boolean" | "select";
/**
 * Operator id. Defaults are contains, equals, not-equals, starts-with,
 * ends-with, greater-than, greater-than-or-equal, less-than,
 * less-than-or-equal, is-empty, and is-not-empty. Extra ids on a field are
 * kept. Unknown ids on a filter coerce to that field's first operator.
 */
export type RowanFilterOperator = string;
/**
 * Frozen field. Top-level conjunction across `filters` is implicit AND.
 */
export type RowanFilterField = {
  id: string;
  label?: string | undefined;
  type?: RowanFilterFieldType | undefined;
  operators?: string[] | undefined;
  options?:
    | (
        | string
        | number
        | boolean
        | {
            value: string;
            label?: string | undefined;
            disabled?: boolean | undefined;
          }
      )[]
    | undefined;
  placeholder?: string | undefined;
};
/**
 * Frozen predicate row. Nested combinator objects are not a public shape.
 */
export type RowanFilter = {
  id: string;
  field: string;
  operator: RowanFilterOperator;
  value: string;
};
/**
 * Experimental group. `join` is `and` or `or`. Children may be frozen leaves
 * or further groups. A node with `field` is always a leaf.
 */
export type RowanFilterGroup = {
  id: string;
  join: "and" | "or";
  filters: Array<RowanFilter | RowanFilterGroup>;
};
import { BaseElement } from "../lib/base-element.js";
export { applyFilters, cloneFilterNode, isFilterGroup } from "./apply-filters.js";
