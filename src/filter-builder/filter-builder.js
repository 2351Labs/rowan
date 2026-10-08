import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { normalizeMessages, resolveMessage } from "../lib/messages.js";
import {
  isRowanTable,
  observeTableAvailability,
  resolveRowanTable,
} from "../lib/table-selection.js";
import { cloneFilterNode, isFilterGroup } from "./apply-filters.js";

const FIELD_TYPES = new Set(["text", "number", "date", "boolean", "select"]);
const VALUELESS_OPERATORS = new Set(["is-empty", "is-not-empty"]);

const DEFAULT_OPERATORS = {
  text: [
    "contains",
    "equals",
    "not-equals",
    "starts-with",
    "ends-with",
    "is-empty",
    "is-not-empty",
  ],
  number: [
    "equals",
    "not-equals",
    "greater-than",
    "greater-than-or-equal",
    "less-than",
    "less-than-or-equal",
    "is-empty",
    "is-not-empty",
  ],
  date: [
    "equals",
    "not-equals",
    "greater-than",
    "greater-than-or-equal",
    "less-than",
    "less-than-or-equal",
    "is-empty",
    "is-not-empty",
  ],
  boolean: ["equals", "not-equals"],
  select: ["equals", "not-equals", "is-empty", "is-not-empty"],
};

const OPERATOR_LABELS = {
  contains: "contains",
  equals: "is",
  "not-equals": "is not",
  "starts-with": "starts with",
  "ends-with": "ends with",
  "greater-than": "is greater than",
  "greater-than-or-equal": "is at least",
  "less-than": "is less than",
  "less-than-or-equal": "is at most",
  "is-empty": "is empty",
  "is-not-empty": "is not empty",
};

const DEFAULT_MESSAGES = Object.freeze({
  addGroupLabel: "Add group",
  addInGroupLabel: "Add filter",
  addLabel: "Add filter",
  booleanFalse: "False",
  booleanTrue: "True",
  chooseValue: "Choose value",
  clearLabel: "Clear filters",
  empty: "No filters applied.",
  fieldLabel: "Filter field",
  groupJoinAnd: "Match all",
  groupJoinOr: "Match any",
  groupJoinLabel: "Group conjunction",
  label: "Filters",
  noValue: "No value",
  operatorLabel: ({ operator }) => OPERATOR_LABELS[operator] ?? operator,
  operatorSelectLabel: "Filter operator",
  remove: "Remove",
  removeFilter: "Remove {field} filter",
  removeGroup: "Remove group",
  unknownField: "Unknown field: {field}",
  value: "Value",
  valueFor: "Value for {label}",
});

function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeOption(value) {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    const text = String(value);
    return { value: text, label: text, disabled: false };
  }

  if (!value || typeof value !== "object") return null;

  const optionValue = normalizeText(value.value);
  if (!optionValue) return null;

  return {
    value: optionValue,
    label: normalizeText(value.label) || optionValue,
    disabled: Boolean(value.disabled),
  };
}

function normalizeOperators(value, type) {
  const source = Array.isArray(value) ? value : DEFAULT_OPERATORS[type];
  const operators = source.map(normalizeText).filter(Boolean);
  return operators.length > 0 ? [...new Set(operators)] : [...DEFAULT_OPERATORS[type]];
}

function normalizeFields(value) {
  const source = Array.isArray(value) ? value : [];
  const ids = new Set();

  return source.reduce((fields, item) => {
    if (!item || typeof item !== "object") return fields;

    const id = normalizeText(item.id ?? item.field);
    if (!id || ids.has(id)) return fields;

    const options = Array.isArray(item.options)
      ? item.options.map(normalizeOption).filter(Boolean)
      : [];
    const configuredType = normalizeText(item.type);
    const type = FIELD_TYPES.has(configuredType)
      ? configuredType
      : options.length > 0
        ? "select"
        : "text";

    ids.add(id);
    fields.push({
      id,
      label: normalizeText(item.label) || id,
      type,
      operators: normalizeOperators(item.operators, type),
      options,
      placeholder: normalizeText(item.placeholder),
    });

    return fields;
  }, []);
}

function cloneField(field) {
  return {
    ...field,
    operators: [...field.operators],
    options: field.options.map((option) => ({ ...option })),
  };
}

function cloneFilter(filter) {
  return cloneFilterNode(filter);
}

/**
 * @typedef {object} RowanFilterBuilderMessages
 * @property {string} [addGroupLabel]
 * @property {string} [addInGroupLabel]
 * @property {string} [addLabel]
 * @property {string} [booleanFalse]
 * @property {string} [booleanTrue]
 * @property {string} [chooseValue]
 * @property {string} [clearLabel]
 * @property {string} [empty]
 * @property {string} [fieldLabel]
 * @property {string} [groupJoinAnd]
 * @property {string} [groupJoinOr]
 * @property {string} [groupJoinLabel]
 * @property {string} [label]
 * @property {string} [noValue]
 * @property {string | ((context: { label: string, operator: string }) => string)} [operatorLabel]
 * @property {string} [operatorSelectLabel]
 * @property {string} [remove]
 * @property {string | ((context: { field: string }) => string)} [removeFilter]
 * @property {string} [removeGroup]
 * @property {string | ((context: { field: string }) => string)} [unknownField]
 * @property {string} [value]
 * @property {string | ((context: { label: string }) => string)} [valueFor]
 */

/**
 * @typedef {"text" | "number" | "date" | "boolean" | "select"} RowanFilterFieldType
 */

/**
 * Operator id. Defaults are contains, equals, not-equals, starts-with,
 * ends-with, greater-than, greater-than-or-equal, less-than,
 * less-than-or-equal, is-empty, and is-not-empty. Extra ids on a field are
 * kept. Unknown ids on a filter coerce to that field's first operator.
 * @typedef {string} RowanFilterOperator
 */

/**
 * Frozen field. Top-level conjunction across `filters` is implicit AND.
 * @typedef {object} RowanFilterField
 * @property {string} id
 * @property {string} [label]
 * @property {RowanFilterFieldType} [type]
 * @property {RowanFilterOperator[]} [operators]
 * @property {Array<string | number | boolean | { value: string, label?: string, disabled?: boolean }>} [options]
 * @property {string} [placeholder]
 */

/**
 * Frozen predicate row. Nested combinator objects are not a public shape.
 * @typedef {object} RowanFilter
 * @property {string} id
 * @property {string} field
 * @property {RowanFilterOperator} operator
 * @property {string} value
 */

/**
 * Experimental group. `join` is `and` or `or`. Children may be frozen leaves
 * or further groups. A node with `field` is always a leaf.
 * @typedef {object} RowanFilterGroup
 * @property {string} id
 * @property {"and" | "or"} join
 * @property {Array<RowanFilter | RowanFilterGroup>} filters
 */

function inferFieldType(column) {
  if (column?.type === "number" || column?.type === "progress") return "number";
  if (column?.type === "date") return "date";
  if (column?.type === "checkbox" || column?.type === "switch") return "boolean";
  return "text";
}

function isFilterableColumn(column) {
  if (!column || typeof column !== "object" || !normalizeText(column.id)) return false;

  return !["button", "icon-button", "custom"].includes(column.type);
}

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
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./filter-builder.css", import.meta.url).href;
  static observedAttributes = ["for-table", "label", "add-label", "clear-label", "disabled"];
  static upgradeProperties = [
    "table",
    "forTable",
    "fields",
    "filters",
    "label",
    "addLabel",
    "clearLabel",
    "disabled",
    "messages",
  ];

  #tableOverride = null;
  #boundTable = null;
  #tableObserver = null;
  #tableAvailabilityCleanup = null;
  #fields = [];
  #hasExplicitFields = false;
  #filters = [];
  #filterSequence = 0;
  #builder = null;
  #title = null;
  #filtersContainer = null;
  #emptyState = null;
  #addButton = null;
  #addGroupButton = null;
  #clearButton = null;
  #messages = {};

  connectedCallback() {
    super.connectedCallback();
    this.#syncTable();
  }

  disconnectedCallback() {
    this.#unbindTable();
    super.disconnectedCallback();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === "for-table" && oldValue !== newValue) {
      this.#syncTable();
    }
  }

  get table() {
    return this.#boundTable;
  }

  set table(value) {
    this.#tableOverride = isRowanTable(value) ? value : null;
    this.#syncTable();
    this.requestRender();
  }

  get forTable() {
    return this.readString("for-table", "").trim();
  }

  set forTable(value) {
    const next = normalizeText(value);
    this.reflectString("for-table", next || null);
  }

  /** @returns {RowanFilterField[]} */
  get fields() {
    return this.#fields.map(cloneField);
  }

  /** @param {RowanFilterField[]} value */
  set fields(value) {
    this.#hasExplicitFields = Array.isArray(value);
    this.#fields = normalizeFields(value);
    this.requestRender();
  }

  /** @returns {Array<RowanFilter | RowanFilterGroup>} */
  get filters() {
    return this.#filters.map(cloneFilter);
  }

  /** @param {Array<RowanFilter | RowanFilterGroup>} value */
  set filters(value) {
    this.#filters = this.#normalizeFilters(value);
    this.requestRender();
  }

  get label() {
    return this.hasAttribute("label")
      ? this.readString("label", DEFAULT_MESSAGES.label)
      : resolveMessage(this.#messages, DEFAULT_MESSAGES, "label");
  }

  set label(value) {
    const next = normalizeText(value);
    this.reflectString("label", next && next !== DEFAULT_MESSAGES.label ? next : null);
  }

  get addLabel() {
    return this.hasAttribute("add-label")
      ? this.readString("add-label", DEFAULT_MESSAGES.addLabel)
      : resolveMessage(this.#messages, DEFAULT_MESSAGES, "addLabel");
  }

  set addLabel(value) {
    const next = normalizeText(value);
    this.reflectString("add-label", next && next !== DEFAULT_MESSAGES.addLabel ? next : null);
  }

  get clearLabel() {
    return this.hasAttribute("clear-label")
      ? this.readString("clear-label", DEFAULT_MESSAGES.clearLabel)
      : resolveMessage(this.#messages, DEFAULT_MESSAGES, "clearLabel");
  }

  set clearLabel(value) {
    const next = normalizeText(value);
    this.reflectString("clear-label", next && next !== DEFAULT_MESSAGES.clearLabel ? next : null);
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
  }

  /** @returns {RowanFilterBuilderMessages} */
  get messages() {
    return { ...this.#messages };
  }

  /** @param {RowanFilterBuilderMessages | null | undefined} value */
  set messages(value) {
    this.#messages = normalizeMessages(value, DEFAULT_MESSAGES);
    this.requestRender();
  }

  addFilter(value = {}) {
    const fields = this.#resolvedFields();
    const field = this.#fieldForId(normalizeText(value.field), fields) ?? fields[0];
    if (!field) return null;

    const filter = this.#normalizeFilter(value, this.#filters.length, this.#usedIds(), field);
    this.#filters = [...this.#filters, filter];
    this.requestRender();
    return cloneFilter(filter);
  }

  removeFilter(id) {
    const filterId = normalizeText(id);
    if (!filterId) return false;
    if (!this.#findNode(this.#filters, filterId)) return false;

    this.#filters = this.#removeNode(this.#filters, filterId);
    this.requestRender();
    return true;
  }

  clearFilters() {
    if (this.#filters.length === 0) return false;

    this.#filters = [];
    this.requestRender();
    return true;
  }

  refresh() {
    this.#syncTable();
    this.requestRender();
  }

  render() {
    if (!this.#builder) {
      this.renderRoot.innerHTML = `
        <section class="builder" part="builder">
          <div class="header" part="header">
            <span class="title"></span>
            <div class="header-actions">
              <button class="clear-button" part="clear-button" type="button" data-action="clear"></button>
              <slot name="actions"></slot>
            </div>
          </div>
          <div class="filters" part="filters" role="list"></div>
          <p class="empty-state" part="empty"></p>
          <div class="footer-actions">
            <button class="add-button" part="add-button" type="button" data-action="add"></button>
            <button class="add-button" part="add-group-button" type="button" data-action="add-group"></button>
          </div>
        </section>
      `;

      this.#builder = this.renderRoot.querySelector(".builder");
      this.#title = this.renderRoot.querySelector(".title");
      this.#filtersContainer = this.renderRoot.querySelector(".filters");
      this.#emptyState = this.renderRoot.querySelector(".empty-state");
      this.#addButton = this.renderRoot.querySelector('[data-action="add"]');
      this.#addGroupButton = this.renderRoot.querySelector('[data-action="add-group"]');
      this.#clearButton = this.renderRoot.querySelector('[data-action="clear"]');

      this.listen(this.#builder, "click", (event) => {
        this.#handleClick(event);
      });
      this.listen(this.#builder, "change", (event) => {
        this.#handleChange(event);
      });
    }

    this.#syncTable();

    const fields = this.#resolvedFields();
    this.#title.textContent = this.label;
    this.#addButton.textContent = this.addLabel;
    this.#addGroupButton.textContent = resolveMessage(
      this.#messages,
      DEFAULT_MESSAGES,
      "addGroupLabel",
    );
    this.#clearButton.textContent = this.clearLabel;
    this.#emptyState.textContent = resolveMessage(this.#messages, DEFAULT_MESSAGES, "empty");
    this.#addButton.disabled = this.disabled || fields.length === 0;
    this.#addGroupButton.disabled = this.disabled || fields.length === 0;
    this.#clearButton.disabled = this.disabled || this.#filters.length === 0;
    this.#clearButton.hidden = this.#filters.length === 0;
    this.#emptyState.hidden = this.#filters.length > 0;
    this.#renderFilters(fields);
    this.#applyDefaultA11y();
  }

  #syncTable() {
    const nextTable = resolveRowanTable(this, this.#tableOverride, this.forTable);
    if (nextTable === this.#boundTable) {
      if (!nextTable) this.#observeTableAvailability();
      return;
    }

    this.#unbindTable();
    this.#boundTable = nextTable;

    if (!nextTable) {
      this.#observeTableAvailability();
      return;
    }

    if (nextTable.shadowRoot && typeof MutationObserver !== "undefined") {
      this.#tableObserver = new MutationObserver(() => {
        if (!this.#hasExplicitFields) this.requestRender();
      });
      this.#tableObserver.observe(nextTable.shadowRoot, { childList: true, subtree: true });
    }
  }

  #unbindTable() {
    this.#tableObserver?.disconnect();
    this.#tableObserver = null;
    this.#tableAvailabilityCleanup?.();
    this.#tableAvailabilityCleanup = null;
    this.#boundTable = null;
  }

  #observeTableAvailability() {
    if (!this.forTable) {
      this.#tableAvailabilityCleanup?.();
      this.#tableAvailabilityCleanup = null;
      return;
    }

    if (!this.isConnected || this.#tableAvailabilityCleanup || this.#tableOverride) {
      return;
    }

    this.#tableAvailabilityCleanup = observeTableAvailability(
      this,
      () => this.forTable,
      () => {
        this.#tableAvailabilityCleanup = null;
        this.#syncTable();
        this.requestRender();
      },
    );
  }

  #resolvedFields() {
    return this.#hasExplicitFields ? this.#fields : this.#inferTableFields();
  }

  #inferTableFields() {
    if (!this.#boundTable || !Array.isArray(this.#boundTable.columns)) return [];

    return normalizeFields(
      this.#boundTable.columns.filter(isFilterableColumn).map((column) => ({
        id: column.id,
        label: normalizeText(column.header) || column.id,
        type: inferFieldType(column),
        options: column.cell?.options,
      })),
    );
  }

  #usedIds(nodes = this.#filters) {
    const ids = new Set();
    const visit = (list) => {
      for (const node of list) {
        if (node.id) ids.add(node.id);
        if (isFilterGroup(node)) visit(node.filters);
      }
    };
    visit(nodes);
    return ids;
  }

  #normalizeFilters(value) {
    const source = Array.isArray(value) ? value : [];
    const ids = new Set();

    return source.reduce((filters, item, index) => {
      const node = this.#normalizeNode(item, index, ids);
      if (!node) return filters;
      filters.push(node);
      return filters;
    }, []);
  }

  #normalizeNode(value, index, ids) {
    if (isFilterGroup(value)) {
      const children = Array.isArray(value.filters) ? value.filters : [];
      const id = this.#uniqueId(normalizeText(value.id) || `group-${index + 1}`, ids);
      ids.add(id);
      const filters = children.reduce((list, child, childIndex) => {
        const node = this.#normalizeNode(child, childIndex, ids);
        if (node) list.push(node);
        return list;
      }, []);
      return {
        id,
        join: value.join === "or" ? "or" : "and",
        filters,
      };
    }

    const fallbackField = this.#resolvedFields()[0] ?? null;
    const filter = this.#normalizeFilter(value, index, ids, fallbackField);
    if (!filter.field) return null;
    ids.add(filter.id);
    return filter;
  }

  #uniqueId(baseId, ids) {
    let id = baseId || "filter-1";
    while (ids.has(id)) {
      this.#filterSequence += 1;
      id = `${baseId}-${this.#filterSequence}`;
    }
    return id;
  }

  #normalizeFilter(value, index, ids, fallbackField) {
    const source = value && typeof value === "object" ? value : {};
    const fields = this.#resolvedFields();
    const requestedField = this.#fieldForId(normalizeText(source.field), fields);
    const field = requestedField ??
      fallbackField ?? { id: normalizeText(source.field), type: "text" };
    const fieldId = normalizeText(field?.id);
    const operators = this.#operatorsForField(field);
    const requestedOperator = normalizeText(source.operator);
    const operator = operators.includes(requestedOperator)
      ? requestedOperator
      : (operators[0] ?? "contains");

    const id = this.#uniqueId(normalizeText(source.id) || `filter-${index + 1}`, ids);

    return {
      id,
      field: fieldId,
      operator,
      value: VALUELESS_OPERATORS.has(operator) ? "" : this.#normalizeValue(source.value, field),
    };
  }

  #normalizeValue(value, field = null) {
    if (field?.type === "boolean") {
      return String(value) === "false" ? "false" : "true";
    }

    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }

    return "";
  }

  #fieldForId(id, fields = this.#resolvedFields()) {
    return fields.find((field) => field.id === id) ?? null;
  }

  #operatorsForField(field) {
    if (Array.isArray(field?.operators) && field.operators.length > 0) {
      return field.operators;
    }

    return DEFAULT_OPERATORS[field?.type] ?? DEFAULT_OPERATORS.text;
  }

  #renderFilters(fields) {
    this.#filtersContainer.textContent = "";
    this.#filters.forEach((node) => {
      this.#filtersContainer.append(
        isFilterGroup(node) ? this.#createGroup(node, fields) : this.#createFilterRow(node, fields),
      );
    });
  }

  #createGroup(group, fields) {
    const card = document.createElement("div");
    card.className = "group";
    card.part = "group";
    card.dataset.filterId = group.id;
    card.setAttribute("role", "listitem");

    const header = document.createElement("div");
    header.className = "group-header";

    const joinSelect = document.createElement("select");
    joinSelect.className = "control";
    joinSelect.dataset.filterId = group.id;
    joinSelect.dataset.filterPart = "join";
    joinSelect.disabled = this.disabled;
    joinSelect.setAttribute(
      "aria-label",
      resolveMessage(this.#messages, DEFAULT_MESSAGES, "groupJoinLabel"),
    );
    this.#appendOption(
      joinSelect,
      "and",
      resolveMessage(this.#messages, DEFAULT_MESSAGES, "groupJoinAnd"),
    );
    this.#appendOption(
      joinSelect,
      "or",
      resolveMessage(this.#messages, DEFAULT_MESSAGES, "groupJoinOr"),
    );
    joinSelect.value = group.join;

    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.type = "button";
    removeButton.dataset.action = "remove";
    removeButton.dataset.filterId = group.id;
    removeButton.disabled = this.disabled;
    removeButton.textContent = resolveMessage(this.#messages, DEFAULT_MESSAGES, "remove");
    removeButton.setAttribute(
      "aria-label",
      resolveMessage(this.#messages, DEFAULT_MESSAGES, "removeGroup"),
    );

    header.append(joinSelect, removeButton);

    const children = document.createElement("div");
    children.className = "group-filters";
    children.setAttribute("role", "list");
    group.filters.forEach((node) => {
      children.append(
        isFilterGroup(node) ? this.#createGroup(node, fields) : this.#createFilterRow(node, fields),
      );
    });

    const addInGroup = document.createElement("button");
    addInGroup.className = "add-button";
    addInGroup.type = "button";
    addInGroup.dataset.action = "add-in-group";
    addInGroup.dataset.filterId = group.id;
    addInGroup.disabled = this.disabled || fields.length === 0;
    addInGroup.textContent = resolveMessage(this.#messages, DEFAULT_MESSAGES, "addInGroupLabel");

    card.append(header, children, addInGroup);
    return card;
  }

  #createFilterRow(filter, fields) {
    const row = document.createElement("div");
    row.className = "filter";
    row.part = "filter";
    row.dataset.filterId = filter.id;
    row.setAttribute("role", "listitem");

    const field = this.#fieldForId(filter.field, fields);
    const fieldSelect = document.createElement("select");
    fieldSelect.className = "control";
    fieldSelect.part = "field-select";
    fieldSelect.dataset.filterId = filter.id;
    fieldSelect.dataset.filterPart = "field";
    fieldSelect.disabled = this.disabled || fields.length === 0;
    fieldSelect.setAttribute(
      "aria-label",
      resolveMessage(this.#messages, DEFAULT_MESSAGES, "fieldLabel"),
    );

    if (!field && filter.field) {
      this.#appendOption(
        fieldSelect,
        filter.field,
        resolveMessage(this.#messages, DEFAULT_MESSAGES, "unknownField", { field: filter.field }),
      );
    }
    fields.forEach((item) => {
      this.#appendOption(fieldSelect, item.id, item.label);
    });
    fieldSelect.value = filter.field;

    const operatorSelect = document.createElement("select");
    operatorSelect.className = "control";
    operatorSelect.part = "operator-select";
    operatorSelect.dataset.filterId = filter.id;
    operatorSelect.dataset.filterPart = "operator";
    operatorSelect.disabled = this.disabled;
    operatorSelect.setAttribute(
      "aria-label",
      resolveMessage(this.#messages, DEFAULT_MESSAGES, "operatorSelectLabel"),
    );

    const operators = this.#operatorsForField(field);
    if (!operators.includes(filter.operator)) {
      this.#appendOption(operatorSelect, filter.operator, this.#operatorLabel(filter.operator));
    }
    operators.forEach((operator) => {
      this.#appendOption(operatorSelect, operator, this.#operatorLabel(operator));
    });
    operatorSelect.value = filter.operator;

    const valueControl = this.#createValueControl(filter, field);

    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.type = "button";
    removeButton.dataset.action = "remove";
    removeButton.dataset.filterId = filter.id;
    removeButton.disabled = this.disabled;
    removeButton.textContent = resolveMessage(this.#messages, DEFAULT_MESSAGES, "remove");
    removeButton.setAttribute(
      "aria-label",
      resolveMessage(this.#messages, DEFAULT_MESSAGES, "removeFilter", {
        field: field?.label ?? filter.field,
      }),
    );

    row.append(fieldSelect, operatorSelect, valueControl, removeButton);
    return row;
  }

  #createValueControl(filter, field) {
    if (VALUELESS_OPERATORS.has(filter.operator)) {
      const status = document.createElement("span");
      status.className = "value-status";
      status.part = "value-control";
      status.textContent = resolveMessage(this.#messages, DEFAULT_MESSAGES, "noValue");
      return status;
    }

    if (field?.type === "boolean") {
      const select = document.createElement("select");
      select.className = "control";
      select.part = "value-control";
      select.dataset.filterId = filter.id;
      select.dataset.filterPart = "value";
      select.disabled = this.disabled;
      select.setAttribute(
        "aria-label",
        resolveMessage(this.#messages, DEFAULT_MESSAGES, "valueFor", { label: field.label }),
      );
      this.#appendOption(
        select,
        "true",
        resolveMessage(this.#messages, DEFAULT_MESSAGES, "booleanTrue"),
      );
      this.#appendOption(
        select,
        "false",
        resolveMessage(this.#messages, DEFAULT_MESSAGES, "booleanFalse"),
      );
      select.value = filter.value === "false" ? "false" : "true";
      return select;
    }

    if (field?.options?.length) {
      const select = document.createElement("select");
      select.className = "control";
      select.part = "value-control";
      select.dataset.filterId = filter.id;
      select.dataset.filterPart = "value";
      select.disabled = this.disabled;
      select.setAttribute(
        "aria-label",
        resolveMessage(this.#messages, DEFAULT_MESSAGES, "valueFor", { label: field.label }),
      );
      this.#appendOption(
        select,
        "",
        resolveMessage(this.#messages, DEFAULT_MESSAGES, "chooseValue"),
      );
      field.options.forEach((option) => {
        this.#appendOption(select, option.value, option.label, option.disabled);
      });
      select.value = filter.value;
      return select;
    }

    const input = document.createElement("input");
    input.className = "control";
    input.part = "value-control";
    input.dataset.filterId = filter.id;
    input.dataset.filterPart = "value";
    input.disabled = this.disabled;
    input.type = field?.type === "number" || field?.type === "date" ? field.type : "text";
    input.value = filter.value;
    input.placeholder =
      field?.placeholder || resolveMessage(this.#messages, DEFAULT_MESSAGES, "value");
    input.setAttribute(
      "aria-label",
      resolveMessage(this.#messages, DEFAULT_MESSAGES, "valueFor", {
        label: field?.label ?? filter.field,
      }),
    );
    return input;
  }

  #appendOption(select, value, label, disabled = false) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    option.disabled = disabled;
    select.append(option);
  }

  #operatorLabel(operator) {
    return resolveMessage(this.#messages, DEFAULT_MESSAGES, "operatorLabel", {
      label: OPERATOR_LABELS[operator] ?? operator,
      operator,
    });
  }

  #handleClick(event) {
    const control = event
      .composedPath()
      .find((node) => node instanceof HTMLElement && node.hasAttribute("data-action"));
    if (!control || this.disabled) return;

    const action = control.getAttribute("data-action");
    if (action === "add") {
      this.#commitAddedFilter();
    } else if (action === "add-group") {
      this.#commitAddedGroup();
    } else if (action === "add-in-group") {
      this.#commitAddedFilterInGroup(control.dataset.filterId ?? "");
    } else if (action === "remove") {
      this.#commitRemovedFilter(control.dataset.filterId ?? "");
    } else if (action === "clear") {
      this.#commitClearedFilters();
    }
  }

  #handleChange(event) {
    const control = event.target;
    if (
      !(control instanceof HTMLInputElement || control instanceof HTMLSelectElement) ||
      this.disabled
    ) {
      return;
    }

    const filterId = control.dataset.filterId ?? "";
    const part = control.dataset.filterPart;
    if (!filterId || !part) return;

    const current = this.#findNode(this.#filters, filterId);
    if (!current) return;

    const fields = this.#resolvedFields();
    let next;

    if (part === "join") {
      if (!isFilterGroup(current)) return;
      next = {
        ...current,
        join: control.value === "or" ? "or" : "and",
        filters: [...current.filters],
      };
    } else if (part === "field") {
      const field = this.#fieldForId(control.value, fields);
      if (!field || isFilterGroup(current)) return;
      next = {
        ...current,
        field: field.id,
        operator: this.#operatorsForField(field)[0] ?? "contains",
        value: "",
      };
    } else if (part === "operator") {
      if (isFilterGroup(current)) return;
      const field = this.#fieldForId(current.field, fields);
      const operators = this.#operatorsForField(field);
      if (!operators.includes(control.value)) return;
      next = { ...current, operator: control.value };
      if (VALUELESS_OPERATORS.has(next.operator)) next.value = "";
    } else if (part === "value") {
      if (isFilterGroup(current)) return;
      next = {
        ...current,
        value: this.#normalizeValue(control.value, this.#fieldForId(current.field, fields)),
      };
    } else {
      return;
    }

    this.#commitUserFilters(this.#replaceNode(this.#filters, filterId, next), "update", next);
  }

  #commitAddedFilter() {
    const fields = this.#resolvedFields();
    const field = fields[0];
    if (!field) return;

    const filter = this.#normalizeFilter(
      { field: field.id },
      this.#filters.length,
      this.#usedIds(),
      field,
    );
    this.#commitUserFilters([...this.#filters, filter], "add", filter);
  }

  #commitAddedGroup() {
    const fields = this.#resolvedFields();
    const field = fields[0];
    if (!field) return;

    const ids = this.#usedIds();
    const first = this.#normalizeFilter({ field: field.id }, 0, ids, field);
    ids.add(first.id);
    const second = this.#normalizeFilter({ field: field.id }, 1, ids, field);
    ids.add(second.id);
    const group = {
      id: this.#uniqueId("group-1", ids),
      join: "or",
      filters: [first, second],
    };
    this.#commitUserFilters([...this.#filters, group], "add", group);
  }

  #commitAddedFilterInGroup(groupId) {
    const group = this.#findNode(this.#filters, groupId);
    if (!isFilterGroup(group)) return;

    const fields = this.#resolvedFields();
    const field = fields[0];
    if (!field) return;

    const filter = this.#normalizeFilter(
      { field: field.id },
      group.filters.length,
      this.#usedIds(),
      field,
    );
    const next = { ...group, filters: [...group.filters, filter] };
    this.#commitUserFilters(this.#replaceNode(this.#filters, groupId, next), "add", filter);
  }

  #commitRemovedFilter(id) {
    const filter = this.#findNode(this.#filters, id);
    if (!filter) return;

    this.#commitUserFilters(this.#removeNode(this.#filters, id), "remove", filter);
  }

  #findNode(nodes, id) {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (isFilterGroup(node)) {
        const match = this.#findNode(node.filters, id);
        if (match) return match;
      }
    }
    return null;
  }

  #replaceNode(nodes, id, next) {
    return nodes.map((node) => {
      if (node.id === id) return next;
      if (isFilterGroup(node)) {
        return { ...node, filters: this.#replaceNode(node.filters, id, next) };
      }
      return node;
    });
  }

  #removeNode(nodes, id) {
    return nodes.flatMap((node) => {
      if (node.id === id) return [];
      if (isFilterGroup(node)) {
        return [{ ...node, filters: this.#removeNode(node.filters, id) }];
      }
      return [node];
    });
  }

  #commitClearedFilters() {
    if (this.#filters.length === 0) return;

    this.#commitUserFilters([], "clear", null);
  }

  #commitUserFilters(filters, action, filter) {
    this.#filters = filters.map(cloneFilter);
    this.requestRender();

    emit(this, "rowan-filter-change", {
      action,
      filter: filter ? cloneFilter(filter) : null,
      filters: this.filters,
    });
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "group";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = this.label;
    }

    if (!this.hasAttribute("aria-disabled") && "ariaDisabled" in this.internals) {
      this.internals.ariaDisabled = this.disabled ? "true" : "false";
    }
  }
}

define("rowan-filter-builder", RowanFilterBuilder);

export { applyFilters, cloneFilterNode, isFilterGroup } from "./apply-filters.js";
