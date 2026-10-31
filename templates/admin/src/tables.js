import { FILTER_SEPARATOR } from "./api.js";
import { button, h } from "./dom.js";

function leafFilters(nodes) {
  const leaves = [];

  for (const node of nodes || []) {
    if (!node || typeof node !== "object") continue;
    if (Array.isArray(node.filters)) {
      leaves.push(...leafFilters(node.filters));
      continue;
    }
    if (!node.field) continue;
    leaves.push({
      id: node.field,
      value: `${node.operator || "contains"}${FILTER_SEPARATOR}${node.value ?? ""}`,
    });
  }

  return leaves;
}

export function mountServerTable(parent, options) {
  const {
    id,
    caption,
    columns,
    density = "md",
    searchLabel,
    searchPlaceholder,
    statusOptions,
    filterFields,
    query,
    filename,
    emptyTitle,
    emptyMessage,
    onActivate,
    onEdit,
    bulkLabel,
    bulkActions = [],
    onBulk,
    toast,
  } = options;

  const root = h("div", { class: "table-stack" });
  const table = h("rowan-table", {
    id,
    caption,
    "caption-visually-hidden": true,
    "data-mode": "server",
    "resizable-columns": true,
    "reorderable-columns": true,
    "sticky-header": true,
    selectable: "multiple",
    density,
    locale: "en-US",
  });
  table.editMode = "cell";
  table.rowActivate = "dblclick";

  const toolbar = h("rowan-table-toolbar", {
    slot: "toolbar",
    "for-table": id,
    "column-picker": true,
    label: caption,
  });
  const start = h("div", { slot: "start", class: "cluster" });
  const search = h("rowan-text-field", {
    class: "toolbar-search",
    type: "search",
    label: searchLabel,
    placeholder: searchPlaceholder,
    name: `${id}-search`,
  });
  start.append(search);

  let status = null;
  if (statusOptions) {
    status = h("rowan-select", {
      class: "toolbar-status",
      label: "Status",
      name: `${id}-status`,
    });
    status.options = [{ value: "all", label: "All statuses" }, ...statusOptions];
    status.value = "all";
    start.append(status);
  }

  const filterBuilder = h("rowan-filter-builder", {
    "for-table": id,
    appearance: "toolbar",
    label: "Filters",
  });
  filterBuilder.fields = filterFields;

  const end = h("div", { slot: "end", class: "cluster" });
  const copyButton = button("Copy", { variant: "ghost", size: "sm", type: "button" });
  const csvButton = button("CSV", {
    variant: "secondary",
    size: "sm",
    type: "button",
  });
  csvButton.prepend(iconSlot("download"));
  const excelButton = button("Excel", {
    variant: "secondary",
    size: "sm",
    type: "button",
  });
  excelButton.prepend(iconSlot("file-spreadsheet"));
  const failSwitch = h("rowan-switch", { label: "Fail next load" });
  failSwitch.textContent = "Fail next load";
  end.append(copyButton, csvButton, excelButton, failSwitch);

  const empty = h("div", { slot: "empty" });
  const emptyState = h("rowan-empty-state");
  emptyState.append(
    h("span", { slot: "title", text: emptyTitle }),
    h("p", { text: emptyMessage }),
    button("Clear filters", {
      slot: "actions",
      id: `${id}-clear`,
      variant: "secondary",
      size: "sm",
    }),
  );
  empty.append(emptyState);

  toolbar.append(start, filterBuilder, end);
  table.append(toolbar, empty);

  const bulk = h("rowan-bulk-actions-bar", {
    "for-table": id,
    label: bulkLabel,
  });
  for (const action of bulkActions) {
    bulk.append(
      button(action.label, {
        "data-bulk-action": action.id,
        variant: action.variant || "secondary",
        size: "sm",
        type: "button",
      }),
    );
  }
  bulk.append(
    button("Export selected", {
      "data-bulk-action": "export",
      variant: "secondary",
      size: "sm",
      type: "button",
    }),
  );

  root.append(bulk, table);
  parent.append(root);

  const state = { q: "", status: "all" };

  function currentFilters() {
    const filters = [];
    if (state.q.trim()) filters.push({ id: "q", value: state.q.trim() });
    if (state.status && state.status !== "all") filters.push({ id: "status", value: state.status });
    filters.push(...leafFilters(filterBuilder.filters));
    return filters;
  }

  function pushFilters() {
    table.filters = currentFilters();
  }

  function reload() {
    table.filters = currentFilters();
  }

  table.config = {
    rowId: "id",
    columns,
    page: { index: 0, size: 8 },
  };

  const source = {
    debounce: 180,
    async getRows(request) {
      const fail = failSwitch.checked;
      failSwitch.checked = false;
      return query({ ...request, fail });
    },
  };

  queueMicrotask(() => {
    if (table.isConnected) table.dataSource = source;
  });

  search.addEventListener("input", () => {
    state.q = search.value;
    pushFilters();
  });
  status?.addEventListener("rowan-change", () => {
    state.status = status.value || "all";
    pushFilters();
  });
  filterBuilder.addEventListener("rowan-filter-change", () => {
    pushFilters();
  });
  empty.querySelector(`#${id}-clear`).addEventListener("rowan-click", () => {
    search.value = "";
    state.q = "";
    state.status = "all";
    if (status) status.value = "all";
    filterBuilder.clearFilters();
    pushFilters();
  });

  table.addEventListener("rowan-row-activate", (event) => {
    const row = event.detail?.row;
    if (row) onActivate?.(row);
  });
  table.addEventListener("rowan-edit-commit", (event) => {
    onEdit?.(event.detail);
    toast?.({
      title: "Saved",
      message: "The cell was written to the sample store.",
      tone: "success",
    });
  });
  table.addEventListener("rowan-export", (event) => {
    if (event.detail?.filename) {
      toast?.({
        title: "Export started",
        message: event.detail.filename,
        tone: "info",
      });
    }
  });

  async function exportFile(format, scope) {
    const getRows = async () => {
      const result = await query({
        page: 0,
        pageSize: 5000,
        sort: table.sort,
        filters: table.filters,
        signal: AbortSignal.timeout(8000),
        fail: false,
        purpose: "export",
      });
      return result.rows;
    };

    try {
      if (format === "xlsx") {
        await table.exportExcel({
          filename: filename.replace(/\.csv$/i, ".xlsx"),
          scope,
          getRows: scope === "selected" ? undefined : getRows,
        });
      } else {
        await table.exportCsv({
          filename,
          scope,
          getRows: scope === "selected" ? undefined : getRows,
        });
      }
    } catch (error) {
      toast?.({
        title: "Export failed",
        message: error instanceof Error ? error.message : "Could not export.",
        tone: "danger",
      });
    }
  }

  copyButton.addEventListener("rowan-click", async () => {
    const scope = table.selected.length ? "selected" : "page";
    try {
      await table.copyToClipboard({ includeHeaders: true, scope });
      toast?.({ title: "Copied", message: "Rows are on the clipboard.", tone: "success" });
    } catch (error) {
      toast?.({
        title: "Copy failed",
        message: error instanceof Error ? error.message : "Could not copy.",
        tone: "danger",
      });
    }
  });
  csvButton.addEventListener("rowan-click", () => exportFile("csv", "all"));
  excelButton.addEventListener("rowan-click", () => exportFile("xlsx", "all"));

  bulk.addEventListener("rowan-bulk-action", async (event) => {
    const action = event.detail?.action;
    const selected = event.detail?.selected || table.selected;
    if (action === "export") {
      await exportFile("csv", "selected");
      return;
    }
    onBulk?.(action, selected, { reload, clear: () => table.clearSelection() });
  });

  return { root, table, reload };
}

function iconSlot(name) {
  const node = document.createElement("rowan-icon");
  node.slot = "prefix";
  node.name = name;
  node.setAttribute("size", "1rem");
  return node;
}
