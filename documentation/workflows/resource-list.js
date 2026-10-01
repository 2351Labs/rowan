import "../../src/button/button.js";
import "../../src/data-state/data-state.js";
import "../../src/empty-state/empty-state.js";
import "../../src/pagination/pagination.js";
import "../../src/spinner/spinner.js";
import "../../src/table-toolbar/table-toolbar.js";
import "../../src/table/table.js";

const PAGE_SIZE = 3;
const DATA_STATES = new Set(["ready", "loading", "empty", "error"]);

const RESOURCES = [
  {
    id: "resource-100",
    name: "Warehouse event stream",
    type: "Stream",
    owner: "Operations",
    region: "US East",
    status: "Healthy",
    updated: "6m ago",
  },
  {
    id: "resource-101",
    name: "Dispatch archive",
    type: "Dataset",
    owner: "Analytics",
    region: "US East",
    status: "Healthy",
    updated: "18m ago",
  },
  {
    id: "resource-102",
    name: "Rate-limit policy",
    type: "Policy",
    owner: "Platform",
    region: "Global",
    status: "Review",
    updated: "42m ago",
  },
  {
    id: "resource-103",
    name: "Returns queue",
    type: "Queue",
    owner: "Fulfillment",
    region: "EU West",
    status: "Healthy",
    updated: "1h ago",
  },
  {
    id: "resource-104",
    name: "Partner delivery webhook",
    type: "Integration",
    owner: "Integrations",
    region: "US West",
    status: "Attention",
    updated: "2h ago",
  },
  {
    id: "resource-105",
    name: "Monthly invoice export",
    type: "Dataset",
    owner: "Billing",
    region: "Global",
    status: "Healthy",
    updated: "3h ago",
  },
  {
    id: "resource-106",
    name: "Support attachment store",
    type: "Storage",
    owner: "Support",
    region: "US East",
    status: "Review",
    updated: "5h ago",
  },
];

const COLUMNS = [
  { id: "name", header: "Resource", minWidth: "16rem" },
  { id: "type", header: "Type", type: "badge" },
  { id: "owner", header: "Owner" },
  { id: "region", header: "Region" },
  {
    id: "status",
    header: "Status",
    type: "badge",
    cell: {
      tone: (value) => {
        if (value === "Attention") return "danger";
        if (value === "Review") return "warning";
        return "success";
      },
    },
  },
  { id: "updated", header: "Updated" },
];

let resourceListInstance = 0;

function cloneRows(rows) {
  return rows.map((row) => ({ ...row }));
}

function cloneColumns() {
  return COLUMNS.map((column) => ({
    ...column,
    cell: column.cell ? { ...column.cell } : undefined,
  }));
}

function normalizeState(value) {
  return DATA_STATES.has(value) ? value : "ready";
}

function resourceLabel(count) {
  return `${count} ${count === 1 ? "resource" : "resources"}`;
}

/**
 * Creates the documentation resource-list composition.
 * Data, pagination, routing, and retries remain in the host callbacks.
 *
 * @param {{
 *   initialState?: "ready" | "loading" | "empty" | "error",
 *   onPageChange?: (detail: { index: number, page: number }) => void,
 *   onRetry?: () => void,
 *   onRoute?: (detail: { type: "resource", rowId: string }) => void,
 * }} [options]
 */
export function createResourceList(options = {}) {
  resourceListInstance += 1;

  const onPageChange = typeof options.onPageChange === "function" ? options.onPageChange : null;
  const onRetry = typeof options.onRetry === "function" ? options.onRetry : null;
  const onRoute = typeof options.onRoute === "function" ? options.onRoute : null;
  const tableId = `docs-resource-list-${resourceListInstance}`;
  let pageIndex = 0;
  let state = normalizeState(options.initialState);
  let rows = cloneRows(RESOURCES);

  const root = document.createElement("section");
  root.className = "workflow-recipe resource-list";
  root.dataset.workflow = "resource-list";

  const summary = document.createElement("p");
  summary.className = "workflow-recipe-summary";
  summary.setAttribute("aria-live", "polite");

  const dataState = document.createElement("rowan-data-state");
  dataState.state = state;

  const loading = document.createElement("div");
  loading.slot = "loading";
  const spinner = document.createElement("rowan-spinner");
  spinner.label = "Loading resources";
  loading.append(spinner);

  const empty = document.createElement("rowan-empty-state");
  empty.slot = "empty";
  const emptyTitle = document.createElement("span");
  emptyTitle.slot = "title";
  emptyTitle.textContent = "No resources";
  const emptyCopy = document.createElement("p");
  emptyCopy.textContent = "Try a different view or create a resource in the application.";
  empty.append(emptyTitle, emptyCopy);

  const error = document.createElement("p");
  error.slot = "error";
  error.textContent = "The resource query could not be completed.";

  const retry = document.createElement("rowan-button");
  retry.slot = "actions";
  retry.variant = "secondary";
  retry.textContent = "Retry";

  const table = document.createElement("rowan-table");
  table.id = tableId;
  table.config = {
    caption: "Resource inventory",
    columns: cloneColumns(),
    rowId: "id",
    rows: [],
  };

  const toolbar = document.createElement("rowan-table-toolbar");
  toolbar.slot = "toolbar";
  toolbar.forTable = tableId;
  toolbar.label = "Resource list controls";
  toolbar.columnPicker = true;
  const toolbarTitle = document.createElement("span");
  toolbarTitle.slot = "start";
  toolbarTitle.textContent = "All resources";
  toolbar.append(toolbarTitle);
  table.append(toolbar);

  const pagination = document.createElement("rowan-pagination");
  pagination.setAttribute("aria-label", "Resource list pages");

  const render = () => {
    const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    pageIndex = Math.min(Math.max(0, pageIndex), totalPages - 1);
    const pageRows = rows.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);

    dataState.state = state;
    table.rows = cloneRows(pageRows);
    pagination.hidden = state !== "ready";
    pagination.page = pageIndex + 1;
    pagination.totalPages = totalPages;

    if (state === "ready") {
      summary.textContent = `Showing ${resourceLabel(pageRows.length)} on page ${pageIndex + 1}.`;
    } else if (state === "empty") {
      summary.textContent = "No resources are available in this application view.";
    } else if (state === "error") {
      summary.textContent = "The application reported an unavailable resource view.";
    } else {
      summary.textContent = "Loading the resource view.";
    }
  };

  pagination.addEventListener("rowan-page-change", (event) => {
    pageIndex = event.detail.index;
    onPageChange?.({ index: pageIndex, page: event.detail.page });
    render();
  });

  table.addEventListener("rowan-row-activate", (event) => {
    const rowId = typeof event.detail?.rowId === "string" ? event.detail.rowId : "";
    if (rowId) onRoute?.({ type: "resource", rowId });
  });

  retry.addEventListener("rowan-click", () => {
    state = "ready";
    pageIndex = 0;
    onRetry?.();
    render();
  });

  dataState.append(table, pagination, loading, empty, error, retry);
  root.append(summary, dataState);
  render();
  return root;
}
