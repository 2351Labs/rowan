const DEFAULT_PAGE_SIZE = 10;

/**
 * Server-mode session. Loaded only when `data-mode="server"`.
 * Owns paging math, the error row, the status text, and the fetch lifecycle.
 * @param {object} host
 */
export function attachServerTable(host) {
  const state = {
    rows: [],
    total: 0,
    loading: false,
    loaded: false,
    error: null,
  };
  const controller = { timer: 0, abort: null, generation: 0 };

  function pageSize() {
    return Math.max(1, host.getPage()?.size || DEFAULT_PAGE_SIZE);
  }

  function resetPage() {
    host.setPage({ index: 0, size: pageSize(), total: state.total });
  }

  function query() {
    return {
      page: host.getPage()?.index ?? 0,
      pageSize: pageSize(),
      sort: host.getSort(),
      filters: host.getFilters().map((filter) => ({ ...filter })),
      source: host.getSource(),
    };
  }

  function apply(patch, event) {
    if (patch.loading != null) state.loading = patch.loading;
    if ("error" in patch) state.error = patch.error;
    if (patch.loaded != null) state.loaded = patch.loaded;
    if (patch.settled && !state.loaded) {
      state.rows = [];
      state.total = 0;
      state.loaded = true;
    }
    if (patch.rows) state.rows = patch.rows;
    if (patch.total != null) state.total = patch.total;
    if (patch.page) host.setPage(patch.page);
    host.dirty();
    host.render();
    if (event) host.emit(event.type, event.detail);
  }

  function cancel() {
    window.clearTimeout(controller.timer);
    controller.abort?.abort();
    controller.generation += 1;
    state.loading = false;
  }

  function queue(debounce) {
    window.clearTimeout(controller.timer);
    const delay = debounce ? Math.max(0, query().source?.debounce ?? 200) : 0;
    controller.timer = window.setTimeout(() => {
      void run(query());
    }, delay);
  }

  async function run(read) {
    const source = read.source;
    if (!source || typeof source.getRows !== "function") {
      const error = new Error("Missing data source");
      apply({ loading: false, error, loaded: false }, {
        type: "rowan-data-error",
        detail: { error, page: read.page, pageSize: read.pageSize, sort: read.sort, filters: read.filters },
      });
      return;
    }

    const detail = {
      page: read.page,
      pageSize: read.pageSize,
      sort: read.sort,
      filters: read.filters,
    };
    if (!host.emit("rowan-data-request", detail, { cancelable: true })) {
      apply({ loading: false, settled: true });
      return;
    }

    controller.generation += 1;
    const generation = controller.generation;
    controller.abort?.abort();
    const abort = new AbortController();
    controller.abort = abort;
    apply({ loading: true, error: null });

    try {
      const result = await source.getRows({ ...detail, signal: abort.signal });
      if (generation !== controller.generation || abort.signal.aborted) return;
      const rows = Array.isArray(result?.rows) ? result.rows : [];
      const total = Number.isFinite(result?.total) ? result.total : rows.length;
      apply(
        {
          loading: false,
          error: null,
          loaded: true,
          rows,
          total,
          page: { index: read.page, size: read.pageSize, total },
        },
        { type: "rowan-data-load", detail: { rows, total, ...detail } },
      );
    } catch (error) {
      if (error?.name === "AbortError" || generation !== controller.generation) return;
      const failure = error instanceof Error ? error : new Error(String(error));
      apply({ loading: false, error: failure }, { type: "rowan-data-error", detail: { error: failure, ...detail } });
    }
  }

  function pageInfo() {
    const size = pageSize();
    const total = Math.max(0, state.total);
    const totalPages = Math.max(1, Math.ceil(total / size) || 1);
    const index = Math.min(host.getPage()?.index ?? 0, totalPages - 1);
    const start = index * size;
    return {
      index: Math.max(0, index),
      size,
      total,
      totalPages,
      start,
      end: start + state.rows.length,
    };
  }

  return {
    rows: () => state.rows,
    isBusy: () => state.loading || (!state.loaded && !state.error),
    hasError: () => state.error != null,
    markUnloaded() {
      state.loaded = false;
      state.error = null;
    },
    cancel,
    queue,
    onSort() {
      resetPage();
      queue(false);
    },
    onFilters() {
      resetPage();
      queue(true);
    },
    changePage(nextIndex) {
      const page = host.getPage();
      const size = page?.size ?? DEFAULT_PAGE_SIZE;
      const totalPages = Math.max(1, Math.ceil(state.total / size) || 1);
      const index = Math.min(Math.max(0, nextIndex), totalPages - 1);
      if (index === (page?.index ?? 0)) return;
      host.setPage({ index, size, total: state.total });
      host.dirty();
      host.render();
      host.emit("rowan-page-change", { index, page: index + 1, size });
      queue(false);
    },
    retainSelection(ordered, selection) {
      const seen = new Set(ordered);
      for (const rowId of host.selectedIds()) {
        if (selection.has(rowId) && !seen.has(rowId)) ordered.push(rowId);
      }
      return ordered;
    },
    syncStatus(status) {
      if (!status) return;
      let text = "";
      if (state.loading || (!state.loaded && !state.error)) {
        text = host.message("loadingRows");
      } else if (state.error) {
        text = host.message("rowsFailed");
      } else if (state.loaded) {
        text = host.message("rowsLoaded", { count: state.total });
      }
      if (status.textContent !== text) status.textContent = text;
    },
    renderError(tbody) {
      const tr = document.createElement("tr");
      tr.part = "tr";
      const td = document.createElement("td");
      td.className = "td data-error";
      td.part = "td";
      td.colSpan = host.columnCount();
      const message = document.createElement("p");
      message.className = "data-error-text";
      message.textContent = host.message("loadError");
      const retry = document.createElement("rowan-button");
      retry.dataset.action = "retry-load";
      retry.textContent = host.message("retry");
      td.append(message, retry);
      tr.append(td);
      tbody.append(tr);
    },
    buildView() {
      const entries = state.rows.map((row, rowIndex) => ({
        row,
        rowIndex,
        rowId: host.rowId(row, rowIndex),
      }));
      host.validateRowIds(entries);
      const hasDuplicateRowIds = host.duplicateRowIds(entries);
      const info = pageInfo();
      const renderRows = entries.map((entry) => ({ ...entry, kind: "row" }));
      const rows = renderRows.map((entry, visibleIndex) => ({ ...entry, visibleIndex }));
      return {
        entries,
        rows,
        dataRows: rows,
        renderRows,
        a11yRows: null,
        pageInfo: info,
        hasDuplicateRowIds,
      };
    },
  };
}
