import { applyFilters } from "../../src/filter-builder/apply-filters.js";
import {
  normalizeTableViewState,
  restoreTableViewState,
  serializeTableViewState,
} from "../../src/table-view-state/table-view-state.js";
import "../../src/button/button.js";
import "../../src/filter-builder/filter-builder.js";
import "../../src/select/select.js";
import "../../src/table-toolbar/table-toolbar.js";
import "../../src/table/table.js";

const WORK_ITEMS = [
  {
    id: "work-101",
    title: "Carrier handoff reconciliation",
    status: "Open",
    owner: "Operations",
    service: "Fulfillment",
    updated: "10m ago",
  },
  {
    id: "work-102",
    title: "Inventory variance review",
    status: "Blocked",
    owner: "Warehouse",
    service: "Inventory",
    updated: "24m ago",
  },
  {
    id: "work-103",
    title: "Webhook retry audit",
    status: "Open",
    owner: "Platform",
    service: "Integrations",
    updated: "38m ago",
  },
  {
    id: "work-104",
    title: "Returns labeling exception",
    status: "Resolved",
    owner: "Support",
    service: "Returns",
    updated: "1h ago",
  },
  {
    id: "work-105",
    title: "Invoice export mapping",
    status: "Open",
    owner: "Billing",
    service: "Accounting",
    updated: "2h ago",
  },
  {
    id: "work-106",
    title: "Warehouse intake validation",
    status: "Blocked",
    owner: "Warehouse",
    service: "Fulfillment",
    updated: "3h ago",
  },
];

const FILTER_FIELDS = [
  {
    id: "status",
    label: "Status",
    type: "select",
    operators: ["equals", "not-equals"],
    options: ["Open", "Blocked", "Resolved"],
  },
  {
    id: "owner",
    label: "Owner",
    type: "select",
    operators: ["equals", "not-equals"],
    options: ["Operations", "Warehouse", "Platform", "Support", "Billing"],
  },
];

const COLUMNS = [
  { id: "title", header: "Work item", minWidth: "16rem", sortable: true },
  {
    id: "status",
    header: "Status",
    type: "badge",
    cell: {
      tone: (value) => {
        if (value === "Blocked") return "danger";
        if (value === "Resolved") return "success";
        return "info";
      },
    },
  },
  { id: "owner", header: "Owner", sortable: true },
  { id: "service", header: "Service" },
  { id: "updated", header: "Updated", sortable: true },
];

let savedTableViewInstance = 0;

function cloneRows(rows) {
  return rows.map((row) => ({ ...row }));
}

function cloneColumns() {
  return COLUMNS.map((column) => ({
    ...column,
    cell: column.cell ? { ...column.cell } : undefined,
  }));
}

function cloneFilters(filters) {
  return filters.map((filter) => ({ ...filter }));
}

function workItemLabel(count) {
  return `${count} ${count === 1 ? "work item" : "work items"}`;
}

function normalizeSavedView(value) {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return null;
  return serializeTableViewState(value);
}

/**
 * Creates the documentation saved-table-view composition.
 * View persistence, URL updates, and source rows remain in host callbacks.
 *
 * @param {{
 *   savedView?: string | object,
 *   onPersist?: (detail: { snapshot: string, view: object }) => void,
 * }} [options]
 */
export function createSavedTableView(options = {}) {
  savedTableViewInstance += 1;

  const onPersist = typeof options.onPersist === "function" ? options.onPersist : null;
  const tableId = `docs-saved-table-view-${savedTableViewInstance}`;
  let filters = [];
  let savedView = normalizeSavedView(options.savedView);

  const root = document.createElement("section");
  root.className = "workflow-recipe saved-table-view";
  root.dataset.workflow = "saved-table-view";

  const summary = document.createElement("p");
  summary.className = "workflow-recipe-summary";
  summary.setAttribute("aria-live", "polite");

  const table = document.createElement("rowan-table");
  table.id = tableId;
  table.config = {
    caption: "Operations work items",
    columns: cloneColumns(),
    rows: [],
    rowId: "id",
    sort: { id: "updated", dir: "desc" },
    page: { index: 0, size: 3, total: WORK_ITEMS.length },
  };

  const toolbar = document.createElement("rowan-table-toolbar");
  toolbar.slot = "toolbar";
  toolbar.forTable = tableId;
  toolbar.label = "Saved view controls";
  toolbar.columnPicker = true;

  const toolbarTitle = document.createElement("span");
  toolbarTitle.slot = "start";
  toolbarTitle.textContent = "Operations view";

  const filterBuilder = document.createElement("rowan-filter-builder");
  filterBuilder.forTable = tableId;
  filterBuilder.label = "Filter work items";
  filterBuilder.fields = FILTER_FIELDS;

  const density = document.createElement("rowan-select");
  density.slot = "end";
  density.label = "Density";
  density.options = [
    { value: "sm", label: "Compact" },
    { value: "md", label: "Comfortable" },
    { value: "lg", label: "Spacious" },
  ];
  density.value = table.density;

  toolbar.append(toolbarTitle, filterBuilder, density);
  table.append(toolbar);

  const actions = document.createElement("div");
  actions.className = "workflow-recipe-actions";

  const save = document.createElement("rowan-button");
  save.variant = "secondary";
  save.textContent = "Save view";

  const restore = document.createElement("rowan-button");
  restore.disabled = !savedView;
  restore.textContent = "Restore saved view";

  const state = document.createElement("output");
  state.className = "workflow-recipe-session";
  state.setAttribute("aria-live", "polite");

  actions.append(save, restore, state);

  const renderRows = (page = table.page) => {
    const visibleRows = applyFilters(WORK_ITEMS, filters, FILTER_FIELDS);
    table.rows = cloneRows(visibleRows);

    if (page) {
      const pageCount = Math.max(1, Math.ceil(visibleRows.length / page.size));
      table.page = {
        ...page,
        index: Math.min(page.index, pageCount - 1),
        total: visibleRows.length,
      };
    }

    summary.textContent = `Showing ${workItemLabel(visibleRows.length)}.`;
  };

  const captureView = () =>
    normalizeTableViewState({
      sort: table.sort,
      page: table.page,
      filters,
      visibleColumns: table.columns.filter((column) => !column.hidden).map((column) => column.id),
      density: table.density,
      groupBy: table.groupBy,
    });

  const renderSavedState = () => {
    state.value = savedView || "";
    state.textContent = savedView ? "Saved snapshot ready." : "No saved snapshot.";
    restore.disabled = !savedView;
  };

  const applyView = (snapshot) => {
    const view = restoreTableViewState(snapshot);
    const visibleColumns = view.visibleColumns ? new Set(view.visibleColumns) : null;

    table.columns = cloneColumns().map((column) => ({
      ...column,
      hidden: visibleColumns ? !visibleColumns.has(column.id) : Boolean(column.hidden),
    }));
    table.sort = view.sort;
    table.density = view.density;
    table.groupBy = view.groupBy;
    density.value = view.density;
    filters = cloneFilters(view.filters);
    filterBuilder.filters = filters;
    renderRows(view.page);
  };

  filterBuilder.addEventListener("rowan-filter-change", (event) => {
    filters = Array.isArray(event.detail?.filters) ? cloneFilters(event.detail.filters) : [];
    renderRows();
  });

  density.addEventListener("rowan-change", (event) => {
    table.density = event.detail?.value;
  });

  save.addEventListener("rowan-click", () => {
    const view = captureView();
    savedView = serializeTableViewState(view);
    renderSavedState();
    onPersist?.({ snapshot: savedView, view });
  });

  restore.addEventListener("rowan-click", () => {
    if (!savedView) return;
    applyView(savedView);
    summary.textContent = `Restored ${workItemLabel(table.rows.length)} from the saved view.`;
  });

  root.append(summary, table, actions);
  if (savedView) {
    applyView(savedView);
  } else {
    renderRows();
  }
  renderSavedState();
  return root;
}
