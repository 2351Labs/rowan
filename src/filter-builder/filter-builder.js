import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { isRowanTable, resolveRowanTable } from "../lib/table-selection.js";

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
  return { ...filter };
}

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
 * @csspart clear-button
 * @cssprop --rowan-filter-builder-bg
 * @cssprop --rowan-filter-builder-border
 * @cssprop --rowan-filter-builder-control-bg
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
  ];

  #tableOverride = null;
  #boundTable = null;
  #tableObserver = null;
  #fields = [];
  #hasExplicitFields = false;
  #filters = [];
  #filterSequence = 0;
  #builder = null;
  #title = null;
  #filtersContainer = null;
  #emptyState = null;
  #addButton = null;
  #clearButton = null;

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

  get fields() {
    return this.#fields.map(cloneField);
  }

  set fields(value) {
    this.#hasExplicitFields = Array.isArray(value);
    this.#fields = normalizeFields(value);
    this.requestRender();
  }

  get filters() {
    return this.#filters.map(cloneFilter);
  }

  set filters(value) {
    this.#filters = this.#normalizeFilters(value);
    this.requestRender();
  }

  get label() {
    return this.readString("label", "Filters");
  }

  set label(value) {
    const next = normalizeText(value);
    this.reflectString("label", next && next !== "Filters" ? next : null);
  }

  get addLabel() {
    return this.readString("add-label", "Add filter");
  }

  set addLabel(value) {
    const next = normalizeText(value);
    this.reflectString("add-label", next && next !== "Add filter" ? next : null);
  }

  get clearLabel() {
    return this.readString("clear-label", "Clear filters");
  }

  set clearLabel(value) {
    const next = normalizeText(value);
    this.reflectString("clear-label", next && next !== "Clear filters" ? next : null);
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
  }

  addFilter(value = {}) {
    const fields = this.#resolvedFields();
    const field = this.#fieldForId(normalizeText(value.field), fields) ?? fields[0];
    if (!field) return null;

    const filter = this.#normalizeFilter(
      value,
      this.#filters.length,
      new Set(this.#filters.map((item) => item.id)),
      field,
    );
    this.#filters = [...this.#filters, filter];
    this.requestRender();
    return cloneFilter(filter);
  }

  removeFilter(id) {
    const filterId = normalizeText(id);
    if (!filterId) return false;

    const nextFilters = this.#filters.filter((filter) => filter.id !== filterId);
    if (nextFilters.length === this.#filters.length) return false;

    this.#filters = nextFilters;
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
          <p class="empty-state" part="empty">No filters applied.</p>
          <button class="add-button" part="add-button" type="button" data-action="add"></button>
        </section>
      `;

      this.#builder = this.renderRoot.querySelector(".builder");
      this.#title = this.renderRoot.querySelector(".title");
      this.#filtersContainer = this.renderRoot.querySelector(".filters");
      this.#emptyState = this.renderRoot.querySelector(".empty-state");
      this.#addButton = this.renderRoot.querySelector('[data-action="add"]');
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
    this.#clearButton.textContent = this.clearLabel;
    this.#addButton.disabled = this.disabled || fields.length === 0;
    this.#clearButton.disabled = this.disabled || this.#filters.length === 0;
    this.#clearButton.hidden = this.#filters.length === 0;
    this.#emptyState.hidden = this.#filters.length > 0;
    this.#renderFilters(fields);
    this.#applyDefaultA11y();
  }

  #syncTable() {
    const nextTable = resolveRowanTable(this, this.#tableOverride, this.forTable);
    if (nextTable === this.#boundTable) return;

    this.#unbindTable();
    this.#boundTable = nextTable;

    if (nextTable?.shadowRoot && typeof MutationObserver !== "undefined") {
      this.#tableObserver = new MutationObserver(() => {
        if (!this.#hasExplicitFields) this.requestRender();
      });
      this.#tableObserver.observe(nextTable.shadowRoot, { childList: true, subtree: true });
    }
  }

  #unbindTable() {
    this.#tableObserver?.disconnect();
    this.#tableObserver = null;
    this.#boundTable = null;
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

  #normalizeFilters(value) {
    const source = Array.isArray(value) ? value : [];
    const ids = new Set();

    return source.reduce((filters, item, index) => {
      const fallbackField = this.#resolvedFields()[0] ?? null;
      const filter = this.#normalizeFilter(item, index, ids, fallbackField);
      if (!filter.field) return filters;

      ids.add(filter.id);
      filters.push(filter);
      return filters;
    }, []);
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

    const baseId = normalizeText(source.id) || `filter-${index + 1}`;
    let id = baseId;
    while (ids.has(id)) {
      this.#filterSequence += 1;
      id = `${baseId}-${this.#filterSequence}`;
    }

    return {
      id,
      field: fieldId,
      operator,
      value: VALUELESS_OPERATORS.has(operator) ? "" : this.#normalizeValue(source.value),
    };
  }

  #normalizeValue(value) {
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

    this.#filters.forEach((filter) => {
      this.#filtersContainer.append(this.#createFilterRow(filter, fields));
    });
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
    fieldSelect.setAttribute("aria-label", "Filter field");

    if (!field && filter.field) {
      this.#appendOption(fieldSelect, filter.field, `Unknown field: ${filter.field}`);
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
    operatorSelect.setAttribute("aria-label", "Filter operator");

    const operators = this.#operatorsForField(field);
    if (!operators.includes(filter.operator)) {
      this.#appendOption(
        operatorSelect,
        filter.operator,
        OPERATOR_LABELS[filter.operator] ?? filter.operator,
      );
    }
    operators.forEach((operator) => {
      this.#appendOption(operatorSelect, operator, OPERATOR_LABELS[operator] ?? operator);
    });
    operatorSelect.value = filter.operator;

    const valueControl = this.#createValueControl(filter, field);

    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.type = "button";
    removeButton.dataset.action = "remove";
    removeButton.dataset.filterId = filter.id;
    removeButton.disabled = this.disabled;
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove ${field?.label ?? filter.field} filter`);

    row.append(fieldSelect, operatorSelect, valueControl, removeButton);
    return row;
  }

  #createValueControl(filter, field) {
    if (VALUELESS_OPERATORS.has(filter.operator)) {
      const status = document.createElement("span");
      status.className = "value-status";
      status.part = "value-control";
      status.textContent = "No value";
      return status;
    }

    if (field?.type === "boolean") {
      const select = document.createElement("select");
      select.className = "control";
      select.part = "value-control";
      select.dataset.filterId = filter.id;
      select.dataset.filterPart = "value";
      select.disabled = this.disabled;
      select.setAttribute("aria-label", `Value for ${field.label}`);
      this.#appendOption(select, "true", "True");
      this.#appendOption(select, "false", "False");
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
      select.setAttribute("aria-label", `Value for ${field.label}`);
      this.#appendOption(select, "", "Choose value");
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
    input.placeholder = field?.placeholder || "Value";
    input.setAttribute("aria-label", `Value for ${field?.label ?? filter.field}`);
    return input;
  }

  #appendOption(select, value, label, disabled = false) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    option.disabled = disabled;
    select.append(option);
  }

  #handleClick(event) {
    const control = event
      .composedPath()
      .find((node) => node instanceof HTMLElement && node.hasAttribute("data-action"));
    if (!control || this.disabled) return;

    const action = control.getAttribute("data-action");
    if (action === "add") {
      this.#commitAddedFilter();
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

    const index = this.#filters.findIndex((filter) => filter.id === filterId);
    if (index === -1) return;

    const current = this.#filters[index];
    const fields = this.#resolvedFields();
    let next = { ...current };

    if (part === "field") {
      const field = this.#fieldForId(control.value, fields);
      if (!field) return;

      next = {
        ...next,
        field: field.id,
        operator: this.#operatorsForField(field)[0] ?? "contains",
        value: "",
      };
    } else if (part === "operator") {
      const field = this.#fieldForId(current.field, fields);
      const operators = this.#operatorsForField(field);
      if (!operators.includes(control.value)) return;

      next.operator = control.value;
      if (VALUELESS_OPERATORS.has(next.operator)) next.value = "";
    } else if (part === "value") {
      next.value = this.#normalizeValue(control.value);
    } else {
      return;
    }

    const nextFilters = [...this.#filters];
    nextFilters[index] = next;
    this.#commitUserFilters(nextFilters, "update", next);
  }

  #commitAddedFilter() {
    const fields = this.#resolvedFields();
    const field = fields[0];
    if (!field) return;

    const filter = this.#normalizeFilter(
      { field: field.id },
      this.#filters.length,
      new Set(this.#filters.map((item) => item.id)),
      field,
    );
    this.#commitUserFilters([...this.#filters, filter], "add", filter);
  }

  #commitRemovedFilter(id) {
    const filter = this.#filters.find((item) => item.id === id);
    if (!filter) return;

    this.#commitUserFilters(
      this.#filters.filter((item) => item.id !== id),
      "remove",
      filter,
    );
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
