import { emit } from "../lib/events.js";

const MAX_LOADS = 100;
const sessions = new WeakMap();

function keyOf(value) {
  try {
    return JSON.stringify(value ?? null);
  } catch {
    return "";
  }
}

function sessionFor(host) {
  let session = sessions.get(host.table);
  if (!session) {
    session = { cache: new Map(), token: 0, loads: 0 };
    sessions.set(host.table, session);
  }
  const rows = host.rows();
  const tree = host.tree();
  const sortKey = keyOf(host.sort());
  const filterKey = keyOf(host.filters());
  if (
    session.rows !== rows ||
    session.tree !== tree ||
    session.sortKey !== sortKey ||
    session.filterKey !== filterKey
  ) {
    session.token += 1;
    for (const item of session.cache.values()) item.abort?.abort();
    session.cache = new Map();
    session.loads = 0;
    session.rows = rows;
    session.tree = tree;
    session.sortKey = sortKey;
    session.filterKey = filterKey;
  }
  return session;
}

function claimsChildren(host, row) {
  const tree = host.tree();
  if (typeof tree?.hasChildren === "function") return Boolean(tree.hasChildren(row));
  return row?.hasChildren === true;
}

function readChildren(host, row) {
  const tree = host.tree();
  if (!tree || tree.parentField) return null;
  const value = typeof tree.getChildren === "function" ? tree.getChildren(row) : row?.[tree.childrenField];
  return Array.isArray(value) ? value : null;
}

function nextIndex(counter) {
  const index = counter.next;
  counter.next += 1;
  return index;
}

function walk(host, row, rowIndex, counter, seen) {
  const rowId = host.rowId(row, rowIndex);
  if (seen.has(rowId)) return null;
  seen.add(rowId);
  const node = { row, rowIndex, rowId, children: [] };
  const kids = readChildren(host, row);
  if (kids) {
    for (const child of kids) {
      const next = walk(host, child, nextIndex(counter), counter, seen);
      if (next) node.children.push(next);
    }
  }
  node.hasChildren = node.children.length > 0 || claimsChildren(host, row);
  return node;
}

function forestFromRows(host, seen, counter) {
  const tree = host.tree();
  const rows = host.rows();
  if (tree?.parentField) {
    const nodes = [];
    const byId = new Map();
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      const rowId = host.rowId(row, index);
      if (seen.has(rowId)) continue;
      seen.add(rowId);
      const node = { row, rowIndex: index, rowId, children: [] };
      nodes.push(node);
      if (!byId.has(rowId)) byId.set(rowId, node);
    }
    const roots = [];
    for (const node of nodes) {
      const parentId = node.row?.[tree.parentField];
      const parent =
        parentId == null || parentId === "" ? null : byId.get(host.normalize(parentId));
      if (parent && parent !== node) parent.children.push(node);
      else roots.push(node);
    }
    for (const node of nodes) {
      node.hasChildren = node.children.length > 0 || claimsChildren(host, node.row);
    }
    return roots;
  }

  const roots = [];
  for (let index = 0; index < rows.length; index += 1) {
    const node = walk(host, rows[index], index, counter, seen);
    if (node) roots.push(node);
  }
  return roots;
}

function attachCache(host, nodes, session, seen, counter) {
  for (const node of nodes) {
    const cached = session.cache.get(node.rowId);
    if (!node.children.length && cached?.status === "ready") {
      for (const row of cached.rows) {
        const child = walk(host, row, nextIndex(counter), counter, seen);
        if (child) node.children.push(child);
      }
      if (node.children.length) node.hasChildren = true;
    }
    attachCache(host, node.children, session, seen, counter);
  }
}

function sortLevel(host, nodes) {
  const sorted = host.sort() ? [...nodes].sort((left, right) => host.compare(left, right)) : nodes;
  for (const node of sorted) node.children = sortLevel(host, node.children);
  return sorted;
}

function quickFilters(host) {
  return host.filters().filter((filter) => {
    if (!filter || filter.field || filter.join || !filter.id) return false;
    return String(filter.value ?? "").trim().length > 0;
  });
}

function matches(host, node, filters) {
  return filters.every((filter) =>
    host.text(node.row, node.rowIndex, filter.id).toLowerCase().includes(String(filter.value).trim().toLowerCase()),
  );
}

function filterLevel(host, nodes, filters) {
  if (!filters.length) return nodes;
  const kept = [];
  for (const node of nodes) {
    const children = filterLevel(host, node.children, filters);
    if (!matches(host, node, filters) && !children.length) continue;
    kept.push({
      ...node,
      children,
      forceOpen: children.length > 0,
    });
  }
  return kept;
}

function collect(nodes, level, indentColumn, out, parents, seen) {
  for (const node of nodes) {
    if (!node || seen.has(node.rowId)) continue;
    seen.add(node.rowId);
    if (node.hasChildren) parents.push(node.rowId);
    out.push({
      row: node.row,
      rowIndex: node.rowIndex,
      rowId: node.rowId,
      level,
      indentColumn,
    });
    collect(node.children, level + 1, indentColumn, out, parents, seen);
  }
}

function ensureLoad(host, node, session) {
  if (!node?.hasChildren || node.children?.length) return;
  if (session.loads >= MAX_LOADS) return;
  if (session.cache.has(node.rowId)) return;
  const source = host.source();
  if (!source || typeof source.getChildren !== "function") return;
  const token = session.token;
  const abort = new AbortController();
  session.cache.set(node.rowId, { status: "loading", rows: [], abort });
  session.loads += 1;
  const parentId = node.rowId;
  void Promise.resolve()
    .then(() =>
      source.getChildren({
        parentId,
        parent: node.row,
        sort: host.sort(),
        filters: host.filters(),
        signal: abort.signal,
      }),
    )
    .then((result) => {
      if (session.token !== token) return;
      const rows = Array.isArray(result?.rows) ? result.rows : [];
      session.cache.set(parentId, { status: "ready", rows, abort });
      host.render();
      if (!host.isExpandAll()) return;
      for (const row of rows) {
        if (!claimsChildren(host, row)) continue;
        ensureLoad(host, { row, rowId: host.rowId(row, 0), hasChildren: true, children: [] }, session);
      }
    })
    .catch((error) => {
      if (error?.name === "AbortError" || session.token !== token) return;
      session.cache.set(parentId, { status: "error", rows: [], abort });
      host.render();
    });
}

function flatten(host, nodes, level, parentId, seen, session, renderRows, byId) {
  const list = nodes.filter((node) => node && !seen.has(node.rowId));
  list.forEach((node, index) => {
    seen.add(node.rowId);
    const expanded = Boolean(node.forceOpen) || host.isExpanded(node.rowId);
    const entry = {
      kind: "row",
      row: node.row,
      rowIndex: node.rowIndex,
      rowId: node.rowId,
      level,
      parentId,
      hasChildren: Boolean(node.hasChildren),
      expanded: node.hasChildren ? expanded : false,
      forceOpen: Boolean(node.forceOpen),
      pos: index + 1,
      setSize: list.length,
      renderKey: `rowan:tree:${node.rowId}`,
    };
    renderRows.push(entry);
    byId.set(node.rowId, entry);
    if (!node.hasChildren || !expanded) return;
    if (node.children.length) {
      flatten(host, node.children, level + 1, node.rowId, seen, session, renderRows, byId);
      return;
    }
    if (!session.cache.has(node.rowId)) ensureLoad(host, node, session);
    const state = session.cache.get(node.rowId);
    if (!state || (state.status !== "loading" && state.status !== "error")) return;
    const failed = state.status === "error";
    renderRows.push({
      kind: "tree-status",
      row: null,
      rowIndex: -1,
      rowId: `rowan:tree-status:${node.rowId}`,
      parentId: node.rowId,
      level: level + 1,
      failed,
      renderKey: `rowan:tree-status:${node.rowId}`,
    });
  });
}

function prepare(host, rootEntries, options = {}) {
  const session = sessionFor(host);
  const seen = new Set();
  const counter = { next: 1_000_000 };
  const roots = rootEntries
    ? rootEntries
        .map((entry) => walk(host, entry.row, entry.rowIndex, counter, seen))
        .filter(Boolean)
    : forestFromRows(host, seen, counter);
  attachCache(host, roots, session, seen, counter);
  const sorted =
    options.sortRoots === false
      ? roots.map((node) => {
          node.children = sortLevel(host, node.children);
          return node;
        })
      : sortLevel(host, roots);
  const filters = quickFilters(host);
  const visibleRoots = filterLevel(host, sorted, filters);
  const indentColumn = host.firstColumnId();
  const exportRows = [];
  const parents = [];
  collect(filters.length ? visibleRoots : sorted, 1, indentColumn, exportRows, parents, new Set());
  host.noteParents(parents);
  return { roots: visibleRoots, exportRows, parents, session };
}

function viewFrom(host, roots, pageInfo, allEntries, duplicate) {
  const session = sessionFor(host);
  const renderRows = [];
  const byId = new Map();
  flatten(host, roots, 1, null, new Set(), session, renderRows, byId);
  session.visible = renderRows;
  session.byId = byId;
  session.parentIds = allEntries.filter((entry) => entry.hasChildren).map((entry) => entry.rowId);
  const dataRows = renderRows
    .filter((entry) => entry.kind === "row")
    .map((entry, visibleIndex) => ({ ...entry, visibleIndex }));
  return {
    entries: allEntries,
    rows: dataRows,
    dataRows,
    renderRows,
    a11yRows: null,
    pageInfo,
    hasDuplicateRowIds: duplicate(allEntries),
  };
}

function allEntries(exportRows, roots) {
  const hasChildren = new Set();
  const walkHas = (nodes, seen) => {
    for (const node of nodes) {
      if (!node || seen.has(node.rowId)) continue;
      seen.add(node.rowId);
      if (node.hasChildren) hasChildren.add(node.rowId);
      walkHas(node.children, seen);
    }
  };
  walkHas(roots, new Set());
  return exportRows.map((entry) => ({ ...entry, hasChildren: hasChildren.has(entry.rowId) }));
}

export function buildClient(host) {
  const prepared = prepare(host);
  host.validate(prepared.exportRows);
  const pageInfo = host.resolvePageInfo(prepared.roots.length);
  const roots = pageInfo ? prepared.roots.slice(pageInfo.start, pageInfo.end) : prepared.roots;
  return viewFrom(host, roots, pageInfo, allEntries(prepared.exportRows, prepared.roots), host.duplicate);
}

export function augmentServer(host, view) {
  const prepared = prepare(host, view.entries, { sortRoots: false });
  const entries = allEntries(prepared.exportRows, prepared.roots);
  host.validate(entries);
  return viewFrom(host, prepared.roots, view.pageInfo, entries, host.duplicate);
}

export function exportEntries(host) {
  return prepare(host).exportRows;
}

export function toggle(host, rowId) {
  const session = sessionFor(host);
  const current = session.byId?.get(rowId);
  if (!current?.hasChildren) return;
  if (current.forceOpen && current.expanded) return;
  const expanded = !current.expanded;
  host.setExpanded(rowId, expanded, session.parentIds ?? []);
  emit(host.table, "rowan-tree-toggle", { rowId, expanded, row: current.row ?? null });
  host.render();
}

export function onKey(host, key, rowId) {
  const visible = (sessionFor(host).visible ?? []).filter((entry) => entry.kind === "row");
  const index = visible.findIndex((entry) => entry.rowId === rowId);
  const entry = visible[index];
  if (!entry) return;
  if (key === "ArrowRight") {
    if (entry.hasChildren && !entry.expanded) {
      toggle(host, rowId);
      return;
    }
    const child = visible.slice(index + 1).find((item) => item.parentId === rowId);
    if (child) host.focus(child.rowId);
    return;
  }
  if (entry.hasChildren && entry.expanded && !entry.forceOpen) {
    toggle(host, rowId);
    return;
  }
  if (entry.parentId) host.focus(entry.parentId);
}

export function expandAll(host) {
  host.markExpandAll();
  const prepared = prepare(host);
  for (const rowId of prepared.parents) {
    const node = findNode(prepared.roots, rowId);
    if (node) ensureLoad(host, node, prepared.session);
  }
  host.render();
}

export function collapseAll(host) {
  host.markCollapseAll();
  host.render();
}

export function retry(host, parentId) {
  const session = sessionFor(host);
  session.cache.get(parentId)?.abort?.abort();
  session.cache.delete(parentId);
  host.render();
}

function findNode(nodes, rowId) {
  for (const node of nodes) {
    if (node.rowId === rowId) return node;
    const child = findNode(node.children, rowId);
    if (child) return child;
  }
  return null;
}

function indent(level) {
  return `calc(${Math.max(0, level - 1)} * var(--rowan-space-5) + var(--rowan-space-3))`;
}

export function decorate(tr, entry, host) {
  tr.setAttribute("role", "row");
  tr.setAttribute("aria-level", String(entry.level));
  if (entry.pos) tr.setAttribute("aria-posinset", String(entry.pos));
  if (entry.setSize) tr.setAttribute("aria-setsize", String(entry.setSize));
  if (entry.hasChildren) tr.setAttribute("aria-expanded", entry.expanded ? "true" : "false");
  const cell = tr.querySelector("td:not(.select-column)");
  if (!cell) return;
  cell.style.paddingInlineStart = indent(entry.level);
  if (!entry.hasChildren) return;
  const name = cell.textContent.trim() || entry.rowId;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "tree-toggle";
  button.dataset.tableAction = "toggle-tree";
  button.dataset.rowId = entry.rowId;
  button.setAttribute("aria-expanded", entry.expanded ? "true" : "false");
  button.setAttribute(
    "aria-label",
    host.message(entry.expanded ? "treeCollapse" : "treeExpand", { name }),
  );
  cell.prepend(button);
}

export function statusRow(entry, columns, host) {
  const tr = document.createElement("tr");
  tr.part = "tr";
  tr.className = "tree-status-row";
  tr.dataset.rowId = entry.rowId;
  tr.dataset.renderKey = entry.renderKey;
  tr.setAttribute("role", "row");
  tr.setAttribute("aria-level", String(entry.level));
  tr.setAttribute("aria-busy", entry.failed ? "false" : "true");
  const td = document.createElement("td");
  td.className = "td tree-status";
  td.colSpan = columns;
  td.style.paddingInlineStart = indent(entry.level);
  if (entry.failed) {
    const message = document.createElement("span");
    message.textContent = host.message("treeChildrenFailed");
    const retryButton = document.createElement("button");
    retryButton.type = "button";
    retryButton.className = "tree-retry";
    retryButton.dataset.action = "retry-tree";
    retryButton.dataset.rowId = entry.parentId;
    retryButton.textContent = host.message("retry");
    td.append(message, retryButton);
  } else {
    td.textContent = host.message("treeLoading");
  }
  tr.append(td);
  return tr;
}
