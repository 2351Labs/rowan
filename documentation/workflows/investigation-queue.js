import { applyFilters } from "../../src/filter-builder/apply-filters.js";
import "../../src/bulk-actions-bar/bulk-actions-bar.js";
import "../../src/filter-builder/filter-builder.js";
import "../../src/row-details-panel/row-details-panel.js";
import "../../src/table-toolbar/table-toolbar.js";
import "../../src/table/table.js";

const INVESTIGATIONS = [
  {
    id: "inc-1042",
    title: "Sync delays after deploy",
    status: "Investigating",
    priority: "P1",
    owner: "Mina",
    service: "Fulfillment",
    updated: "10m ago",
  },
  {
    id: "inc-1044",
    title: "Search index backlog",
    status: "Monitoring",
    priority: "P2",
    owner: "Lee",
    service: "Search",
    updated: "24m ago",
  },
  {
    id: "inc-1046",
    title: "Webhook delivery retries",
    status: "Investigating",
    priority: "P2",
    owner: "Alex",
    service: "Integrations",
    updated: "38m ago",
  },
  {
    id: "inc-1048",
    title: "Mobile checkout errors",
    status: "Mitigated",
    priority: "P1",
    owner: "Riley",
    service: "Checkout",
    updated: "1h ago",
  },
  {
    id: "inc-1050",
    title: "Billing export timeout",
    status: "Monitoring",
    priority: "P3",
    owner: "Mina",
    service: "Billing",
    updated: "2h ago",
  },
];

const FILTER_FIELDS = [
  {
    id: "status",
    label: "Status",
    type: "select",
    operators: ["equals", "not-equals"],
    options: ["Investigating", "Monitoring", "Mitigated", "Resolved"],
  },
  {
    id: "priority",
    label: "Priority",
    type: "select",
    operators: ["equals", "not-equals"],
    options: ["P1", "P2", "P3"],
  },
  {
    id: "owner",
    label: "Owner",
    type: "select",
    operators: ["equals", "not-equals"],
    options: ["Alex", "Lee", "Mina", "Riley", "Triage"],
  },
];

const COLUMNS = [
  { id: "title", header: "Investigation", minWidth: "16rem" },
  {
    id: "status",
    header: "Status",
    type: "badge",
    cell: {
      tone: (value) => {
        if (value === "Investigating") return "danger";
        if (value === "Mitigated") return "success";
        return "info";
      },
    },
  },
  {
    id: "priority",
    header: "Priority",
    type: "badge",
    cell: {
      tone: (value) => (value === "P1" ? "danger" : value === "P2" ? "warning" : "neutral"),
    },
  },
  { id: "owner", header: "Owner" },
  { id: "service", header: "Service" },
  { id: "updated", header: "Updated" },
];

let queueInstance = 0;

function cloneRows(rows) {
  return rows.map((row) => ({ ...row }));
}

function cloneColumns() {
  return COLUMNS.map((column) => ({
    ...column,
    cell: column.cell ? { ...column.cell } : undefined,
  }));
}

function rowLabel(count) {
  return `${count} ${count === 1 ? "investigation" : "investigations"}`;
}

/**
 * Creates the documentation investigation-queue composition.
 * Data, routing, and persistence remain in the host callbacks.
 *
 * @param {{
 *   onPersist?: (detail: { action: string, selected: string[], rows: object[] }) => void,
 *   onRoute?: (detail: { type: "inspect" | "close", rowId: string | null }) => void,
 * }} [options]
 */
export function createInvestigationQueue(options = {}) {
  queueInstance += 1;

  const onPersist = typeof options.onPersist === "function" ? options.onPersist : null;
  const onRoute = typeof options.onRoute === "function" ? options.onRoute : null;
  const tableId = `docs-investigation-queue-${queueInstance}`;
  let filters = [];
  let rows = cloneRows(INVESTIGATIONS);

  const root = document.createElement("section");
  root.className = "workflow-recipe investigation-queue";
  root.dataset.workflow = "investigation-queue";

  const summary = document.createElement("p");
  summary.className = "workflow-recipe-summary";
  summary.setAttribute("aria-live", "polite");

  const table = document.createElement("rowan-table");
  table.id = tableId;
  table.config = {
    caption: "Open investigations",
    columns: cloneColumns(),
    rowId: "id",
    rows: [],
    selectable: "multiple",
  };

  const toolbar = document.createElement("rowan-table-toolbar");
  toolbar.slot = "toolbar";
  toolbar.forTable = tableId;
  toolbar.label = "Investigation controls";
  toolbar.columnPicker = true;

  const toolbarTitle = document.createElement("span");
  toolbarTitle.slot = "start";
  toolbarTitle.textContent = "Active queue";

  const filterBuilder = document.createElement("rowan-filter-builder");
  filterBuilder.forTable = tableId;
  filterBuilder.label = "Filter investigations";
  filterBuilder.fields = FILTER_FIELDS;
  toolbar.append(toolbarTitle, filterBuilder);

  const bulkActions = document.createElement("rowan-bulk-actions-bar");
  bulkActions.slot = "toolbar";
  bulkActions.forTable = tableId;
  bulkActions.label = "Investigation bulk actions";
  bulkActions.actions = [
    { id: "assign-triage", label: "Assign triage", variant: "secondary" },
    { id: "resolve", label: "Mark resolved" },
  ];

  const details = document.createElement("rowan-row-details-panel");
  details.forTable = tableId;
  details.label = "Investigation details";

  const renderRows = (message = "") => {
    const filteredRows = applyFilters(rows, filters, FILTER_FIELDS);
    table.rows = cloneRows(filteredRows);
    summary.textContent = message || `Showing ${rowLabel(filteredRows.length)}.`;
  };

  filterBuilder.addEventListener("rowan-filter-change", (event) => {
    filters = Array.isArray(event.detail?.filters)
      ? event.detail.filters.map((filter) => ({ ...filter }))
      : [];
    renderRows();
  });

  bulkActions.addEventListener("rowan-bulk-action", (event) => {
    const selected = Array.isArray(event.detail?.selected) ? [...event.detail.selected] : [];
    const selectedIds = new Set(selected);
    const action = event.detail?.action;
    if (selectedIds.size === 0 || !["assign-triage", "resolve"].includes(action)) return;

    rows = rows.map((row) => {
      if (!selectedIds.has(row.id)) return row;
      if (action === "assign-triage") return { ...row, owner: "Triage" };
      return { ...row, status: "Resolved" };
    });

    onPersist?.({ action, selected, rows: cloneRows(rows) });
    table.selected = [];
    renderRows(
      action === "assign-triage"
        ? `Assigned ${rowLabel(selectedIds.size)} to triage.`
        : `Marked ${rowLabel(selectedIds.size)} resolved.`,
    );
  });

  table.addEventListener("rowan-row-activate", (event) => {
    const rowId = typeof event.detail?.rowId === "string" ? event.detail.rowId : null;
    if (rowId) onRoute?.({ type: "inspect", rowId });
  });

  details.addEventListener("rowan-close", () => {
    onRoute?.({ type: "close", rowId: null });
  });

  table.append(toolbar, bulkActions);
  root.append(summary, table, details);
  renderRows();
  return root;
}
