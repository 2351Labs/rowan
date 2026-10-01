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
 * @csspart clear-button
 * @cssprop --rowan-filter-builder-bg
 * @cssprop --rowan-filter-builder-border
 * @cssprop --rowan-filter-builder-control-bg
 * @property {RowanFilterField[]} fields - Filterable fields. Arrays are property-only.
 * @property {RowanFilter[]} filters - Flat AND list of predicates. Arrays are property-only.
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
  /** @param {RowanFilter[]} value */
  set filters(value: RowanFilter[]);
  /** @returns {RowanFilter[]} */
  get filters(): RowanFilter[];
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
export { applyFilters } from "./apply-filters.js";
export type RowanFilterBuilderMessages = {
  addLabel?: string | undefined;
  booleanFalse?: string | undefined;
  booleanTrue?: string | undefined;
  chooseValue?: string | undefined;
  clearLabel?: string | undefined;
  empty?: string | undefined;
  fieldLabel?: string | undefined;
  label?: string | undefined;
  noValue?: string | undefined;
  operatorLabel?: string | ((context: { label: string; operator: string }) => string) | undefined;
  operatorSelectLabel?: string | undefined;
  remove?: string | undefined;
  removeFilter?: string | ((context: { field: string }) => string) | undefined;
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
 * Frozen field. Conjunction across `filters` is implicit AND. There are no groups.
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
import { BaseElement } from "../lib/base-element.js";
