const adapterLoaders = {
  rowan: () => import("./adapters/rowan.js"),
  lit: () => import("./adapters/lit.js"),
  fast: () => import("./adapters/fast.js"),
  webawesome: () => import("./adapters/webawesome.js"),
};

const tableRowCount = 100;
const tablePageSize = 50;
const root = document.querySelector("#benchmark-root");

function round(value) {
  return Math.round(value * 1000) / 1000;
}

function readHeapSize() {
  return Number.isFinite(performance.memory?.usedJSHeapSize)
    ? performance.memory.usedJSHeapSize
    : null;
}

function heapGrowth(before, after) {
  return before === null || after === null ? null : after - before;
}

function resourceMetrics(startTime) {
  const resources = performance
    .getEntriesByType("resource")
    .filter(
      (entry) => entry.initiatorType === "script" && entry.startTime >= Math.max(0, startTime - 1),
    );

  return {
    resourceCount: resources.length,
    transferBytes: resources.reduce((total, entry) => total + (entry.transferSize || 0), 0),
  };
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

async function waitFor(check, label) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    await Promise.resolve();
    await Promise.resolve();

    if (check()) return;

    await nextFrame();
  }

  throw new Error(`Timed out waiting for ${label}.`);
}

async function measureLoad(load) {
  const heapBefore = readHeapSize();
  const startTime = performance.now();
  const value = await load();
  const endTime = performance.now();
  const heapAfter = readHeapSize();

  return {
    value,
    metrics: {
      durationMs: round(endTime - startTime),
      heapGrowthBytes: heapGrowth(heapBefore, heapAfter),
      ...resourceMetrics(startTime),
    },
  };
}

async function measureDomOperation(action, ready, label) {
  const heapBefore = readHeapSize();
  const startTime = performance.now();
  await action();
  await waitFor(ready, label);
  const endTime = performance.now();
  const heapAfter = readHeapSize();

  return {
    durationMs: round(endTime - startTime),
    heapGrowthBytes: heapGrowth(heapBefore, heapAfter),
  };
}

function makeRows(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: `member-${String(index).padStart(3, "0")}`,
    name: `Member ${String(count - index).padStart(3, "0")}`,
    role: ["Admin", "Editor", "Viewer", "Owner"][index % 4],
    quota: (index * 7) % 101,
  }));
}

function getTableRows(table) {
  return [...table.shadowRoot.querySelectorAll("tbody tr[data-row-id]")];
}

function getControlShadowElements(container) {
  return [...container.children].flatMap((control) => [
    ...(control.shadowRoot?.querySelectorAll("*") ?? []),
  ]);
}

function reusedElementsPercent(before, after) {
  if (!after.length) return null;

  const priorElements = new Set(before);
  return round((after.filter((element) => priorElements.has(element)).length / after.length) * 100);
}

async function runTableBenchmark(adapter) {
  if (typeof adapter.loadTable !== "function") {
    return {
      supported: false,
      reason: adapter.tableUnavailableReason,
    };
  }

  const tableModule = await measureLoad(() => adapter.loadTable());
  const rows = makeRows(tableRowCount);
  const sortedRows = [...rows].sort((left, right) => left.name.localeCompare(right.name));
  const table = tableModule.value.createTable(rows);

  const firstRender = await measureDomOperation(
    () => root.replaceChildren(table),
    () => getTableRows(table).length === rows.length,
    "the Rowan table initial render",
  );

  const selectionBefore = getTableRows(table);
  const selection = await measureDomOperation(
    () => {
      table.selected = [rows[0].id];
    },
    () => {
      const selector = table.shadowRoot.querySelector(
        `tr[data-row-id="${rows[0].id}"] rowan-checkbox`,
      );
      return selector?.checked === true;
    },
    "the Rowan table selection update",
  );
  selection.reusedRowsPercent = reusedElementsPercent(selectionBefore, getTableRows(table));

  const sortBefore = getTableRows(table);
  const sort = await measureDomOperation(
    () => {
      table.sortBy("name", "asc");
    },
    () => getTableRows(table)[0]?.dataset.rowId === sortedRows[0].id,
    "the Rowan table sort update",
  );
  sort.reusedRowsPercent = reusedElementsPercent(sortBefore, getTableRows(table));

  table.page = { index: 0, size: tablePageSize, total: rows.length };
  await waitFor(
    () =>
      getTableRows(table).length === tablePageSize &&
      getTableRows(table)[0]?.dataset.rowId === sortedRows[0].id,
    "the Rowan table first page",
  );

  const pageBefore = getTableRows(table);
  const page = await measureDomOperation(
    () => {
      table.page = { index: 1, size: tablePageSize, total: rows.length };
    },
    () =>
      getTableRows(table).length === tablePageSize &&
      getTableRows(table)[0]?.dataset.rowId === sortedRows[tablePageSize].id,
    "the Rowan table page update",
  );
  page.reusedRowsPercent = reusedElementsPercent(pageBefore, getTableRows(table));

  return {
    supported: true,
    rowCount: tableRowCount,
    pageSize: tablePageSize,
    importDefinition: tableModule.metrics,
    firstRender,
    selection,
    sort,
    page,
  };
}

async function run() {
  const adapterId = new URLSearchParams(location.search).get("adapter");
  const loadAdapter = adapterLoaders[adapterId];

  if (!loadAdapter) {
    throw new Error(`Unsupported benchmark adapter "${adapterId}".`);
  }

  const adapter = await loadAdapter();
  const foundationModule = await measureLoad(() => adapter.loadFoundation());
  const foundation = foundationModule.value;
  const controls = foundation.createControls();

  const firstRender = await measureDomOperation(
    () => root.replaceChildren(controls),
    () => foundation.isRendered(controls),
    `${adapter.label} control render`,
  );

  const reconnectBefore = getControlShadowElements(controls);
  const reconnect = await measureDomOperation(
    () => {
      controls.remove();
      root.append(controls);
    },
    () => foundation.isRendered(controls),
    `${adapter.label} control reconnect`,
  );
  reconnect.shadowDomReusePercent = reusedElementsPercent(
    reconnectBefore,
    getControlShadowElements(controls),
  );

  const table = await runTableBenchmark(adapter);

  return {
    adapter: {
      id: adapterId,
      label: adapter.label,
      scope: adapter.scope,
    },
    userAgent: navigator.userAgent,
    foundation: {
      importDefinition: foundationModule.metrics,
      firstRender,
      reconnect,
    },
    table,
  };
}

void run()
  .then((result) => {
    globalThis.__rowanBenchmarkResult = { ok: true, result };
  })
  .catch((error) => {
    globalThis.__rowanBenchmarkResult = {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  });
