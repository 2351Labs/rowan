import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { keys } from "../lib/keys.js";
import { normalizeMessages, resolveMessage } from "../lib/messages.js";
import {
  isRowanTable,
  observeTableAvailability,
  resolveRowanTable,
} from "../lib/table-selection.js";
import { clearColumnWidths, columnWidth, setColumnWidth } from "../table/column-widths.js";
import {
  normalizeTableViewState,
  readTableViewStateSearch,
  writeTableViewStateSearch,
} from "../table-view-state/table-view-state.js";

import "../dropdown/dropdown.js";
import componentStyles from "./saved-views.styles.js";

/** Maximum saved-view name length, after trimming and collapsing whitespace. */
export const SAVED_VIEW_NAME_MAX = 80;

const SHARE_MODES = new Set(["on", "off"]);

const DEFAULT_MESSAGES = Object.freeze({
  applied: "Applied {name}.",
  confirmDelete: "Confirm delete {name}",
  copied: "Link copied.",
  copyFailed: "The link could not be copied.",
  applyLabel: "Apply {name}",
  copyLink: "Copy link",
  copyViewLink: "Copy link for {name}",
  defaultBadge: "Default",
  defaultSet: "{name} is the default view.",
  delete: "Delete {name}",
  deleted: "Deleted {name}.",
  duplicateName: "A view named {name} already exists.",
  empty: "No saved views.",
  emptyName: "Enter a view name.",
  label: "Saved views",
  nameLabel: "View name",
  nameTooLong: "Use a name up to {max} characters.",
  noTable: "Connect a table before saving a view.",
  missingView: "That view is no longer available.",
  rename: "Rename {name}",
  renamed: "Renamed to {name}.",
  save: "Save",
  saveFailed: "The view could not be saved.",
  saved: "Saved {name}.",
  setDefault: "Set {name} as the default view",
});

/**
 * @typedef {object} RowanSavedView
 * @property {string} id
 * @property {string} name
 * @property {import("../table-view-state/table-view-state.js").RowanTableViewState} state
 * @property {boolean} isDefault
 * @property {number} updatedAt
 */

/**
 * @typedef {object} RowanSavedViewStorage
 * @property {(key: string) => RowanSavedView[] | null | Promise<RowanSavedView[] | null>} load
 * @property {(key: string, views: RowanSavedView[]) => void | Promise<void>} save
 */

/**
 * @typedef {object} RowanSavedViewsMessages
 * @property {string} [applied]
 * @property {string} [confirmDelete]
 * @property {string} [applyLabel]
 * @property {string} [copied]
 * @property {string} [copyFailed]
 * @property {string} [copyLink]
 * @property {string} [copyViewLink]
 * @property {string} [defaultBadge]
 * @property {string} [defaultSet]
 * @property {string} [delete]
 * @property {string} [deleted]
 * @property {string} [duplicateName]
 * @property {string} [empty]
 * @property {string} [emptyName]
 * @property {string} [label]
 * @property {string} [nameLabel]
 * @property {string} [nameTooLong]
 * @property {string} [noTable]
 * @property {string} [missingView]
 * @property {string} [rename]
 * @property {string} [renamed]
 * @property {string} [save]
 * @property {string} [saveFailed]
 * @property {string} [saved]
 * @property {string} [setDefault]
 */

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

function cloneView(view) {
  return {
    id: view.id,
    name: view.name,
    state: normalizeTableViewState(view.state),
    isDefault: Boolean(view.isDefault),
    updatedAt: view.updatedAt,
  };
}

function cloneViews(views) {
  return views.map(cloneView);
}

function createId() {
  const uuid = globalThis.crypto?.randomUUID?.();
  if (uuid) return `view-${uuid}`;
  return `view-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeStoredView(value) {
  if (!isRecord(value)) return null;
  const id = normalizeText(value.id);
  const name = normalizeText(value.name);
  if (!id || !name || name.length > SAVED_VIEW_NAME_MAX) return null;
  if (
    isRecord(value.state) &&
    Object.hasOwn(value.state, "version") &&
    value.state.version !== 1 &&
    value.state.version !== 2
  ) {
    return null;
  }

  const updatedAt = Number(value.updatedAt);
  return {
    id,
    name,
    state: normalizeTableViewState(value.state),
    isDefault: Boolean(value.isDefault),
    updatedAt: Number.isFinite(updatedAt) ? Math.trunc(updatedAt) : 0,
  };
}

function normalizeStoredList(value) {
  if (!Array.isArray(value)) return [];
  const seenIds = new Set();
  const seenNames = new Set();
  const views = [];
  let defaultSeen = false;

  for (const item of value) {
    const view = normalizeStoredView(item);
    if (!view || seenIds.has(view.id)) continue;
    const nameKey = view.name.toLowerCase();
    if (seenNames.has(nameKey)) continue;
    seenIds.add(view.id);
    seenNames.add(nameKey);
    if (view.isDefault) {
      if (defaultSeen) view.isDefault = false;
      defaultSeen = true;
    }
    views.push(view);
  }

  return views;
}

function result(ok, code, view, views) {
  return { ok, code: code || "", view: view ? cloneView(view) : null, views: cloneViews(views) };
}

/**
 * In-memory storage adapter. Useful in tests and when the page has no `localStorage`.
 * @param {RowanSavedView[]} [initial]
 * @returns {RowanSavedViewStorage}
 */
export function createMemorySavedViewStorage(initial = []) {
  let views = normalizeStoredList(initial);
  return {
    load() {
      return cloneViews(views);
    },
    save(_key, next) {
      views = normalizeStoredList(next);
    },
  };
}

/**
 * `localStorage` adapter. `load` returns an empty list when storage is missing or corrupt.
 * @param {Pick<Storage, "getItem" | "setItem"> | null} [backend]
 * @returns {RowanSavedViewStorage}
 */
export function createLocalStorageSavedViewStorage(backend) {
  const storage = backend === undefined ? globalThis.localStorage : backend;
  return {
    load(key) {
      try {
        const raw = storage?.getItem(String(key));
        if (!raw) return [];
        return normalizeStoredList(JSON.parse(raw));
      } catch {
        return [];
      }
    },
    save(key, views) {
      storage?.setItem(String(key), JSON.stringify(normalizeStoredList(views)));
    },
  };
}

/**
 * Named saved views for one table. The store normalizes every state to table-view-state v2.
 * Pass `storage` to persist on a server. The default adapter is `localStorage`.
 * @param {{ key: string, storage?: RowanSavedViewStorage }} options
 */
export function createSavedViewStore(options) {
  const key = normalizeText(options?.key) || "rowan-saved-views:default";
  const storage = options?.storage ?? createLocalStorageSavedViewStorage();
  const listeners = new Set();
  let views = [];
  let loaded = false;

  async function read() {
    if (!loaded) {
      views = normalizeStoredList(await storage.load(key));
      loaded = true;
    }
    return views;
  }

  async function write(next, reason) {
    views = normalizeStoredList(next);
    await storage.save(key, views);
    const detail = { views: cloneViews(views), reason };
    for (const listener of listeners) listener(detail);
    return views;
  }

  return {
    key,
    storage,
    async list() {
      return cloneViews(await read());
    },
    async get(id) {
      const views = await read();
      const found = views.find((view) => view.id === normalizeText(id));
      return found ? cloneView(found) : null;
    },
    async save({ id, name, state } = {}) {
      const current = await read();
      const nextName = normalizeText(name);
      if (!nextName) return result(false, "empty-name", null, current);
      if (nextName.length > SAVED_VIEW_NAME_MAX)
        return result(false, "name-too-long", null, current);

      const requestedId = normalizeText(id);
      const existing = requestedId ? current.find((view) => view.id === requestedId) : null;
      if (requestedId && !existing) return result(false, "missing-view", null, current);
      const nameKey = nextName.toLowerCase();
      if (current.some((view) => view.name.toLowerCase() === nameKey && view.id !== existing?.id)) {
        return result(false, "duplicate-name", null, current);
      }

      const view = {
        id: existing?.id ?? createId(),
        name: nextName,
        state: normalizeTableViewState(state),
        isDefault: Boolean(existing?.isDefault),
        updatedAt: Date.now(),
      };
      const next = existing
        ? current.map((item) => (item.id === view.id ? view : item))
        : [...current, view];
      await write(next, "save");
      return result(true, "", view, views);
    },
    async rename(id, name) {
      const current = await read();
      const existing = current.find((view) => view.id === normalizeText(id));
      if (!existing) return result(false, "missing-view", null, current);
      const nextName = normalizeText(name);
      if (!nextName) return result(false, "empty-name", null, current);
      if (nextName.length > SAVED_VIEW_NAME_MAX)
        return result(false, "name-too-long", null, current);
      const nameKey = nextName.toLowerCase();
      if (current.some((view) => view.name.toLowerCase() === nameKey && view.id !== existing.id)) {
        return result(false, "duplicate-name", null, current);
      }
      const view = {
        ...existing,
        name: nextName,
        state: cloneView(existing).state,
        updatedAt: Date.now(),
      };
      await write(
        current.map((item) => (item.id === view.id ? view : item)),
        "rename",
      );
      return result(true, "", view, views);
    },
    async delete(id) {
      const current = await read();
      const existing = current.find((view) => view.id === normalizeText(id));
      if (!existing) return result(false, "missing-view", null, current);
      await write(
        current.filter((view) => view.id !== existing.id),
        "delete",
      );
      return result(true, "", existing, views);
    },
    async setDefault(id) {
      const current = await read();
      const requested = normalizeText(id);
      if (requested && !current.some((view) => view.id === requested)) {
        return result(false, "missing-view", null, current);
      }
      const next = current.map((view) => ({
        ...view,
        isDefault: Boolean(requested) && view.id === requested,
      }));
      await write(next, "default");
      const view = next.find((item) => item.id === requested) ?? null;
      return result(true, "", view, views);
    },
    subscribe(listener) {
      if (typeof listener !== "function") return () => {};
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/**
 * Reads the filter builder inside a table, when one is slotted there.
 * @param {HTMLElement | null | undefined} table
 * @returns {HTMLElement | null}
 */
export function findTableFilterBuilder(table) {
  return table?.querySelector?.("rowan-filter-builder") ?? null;
}

/**
 * Captures the public table fields that table-view-state v2 stores.
 * A linked filter builder supplies the filter tree. Quick find is not included.
 * @param {HTMLElement | null | undefined} table
 * @returns {import("../table-view-state/table-view-state.js").RowanTableViewState}
 */
export function captureTableViewState(table) {
  if (!isRowanTable(table)) return normalizeTableViewState();
  const columns = Array.isArray(table.columns)
    ? table.columns.filter((column) => normalizeText(column?.id))
    : [];
  const builder = findTableFilterBuilder(table);
  const widths = {};
  for (const column of columns) {
    const id = normalizeText(column.id);
    const width = columnWidth(table, id);
    if (width) widths[id] = String(width);
  }

  return normalizeTableViewState({
    sort: table.sort,
    page: table.page,
    filters: builder ? builder.filters : table.filters,
    visibleColumns: columns
      .filter((column) => !column.hidden)
      .map((column) => normalizeText(column.id)),
    columnWidths: Object.keys(widths).length > 0 ? widths : null,
    columnOrder: columns.map((column) => normalizeText(column.id)),
    density: table.density,
    groupBy: table.groupBy,
  });
}

/**
 * Assigns a version 2 view onto a table and its filter builder.
 * Page is applied last because server sort and filter changes reset it.
 * In client mode the filter builder replaces `rows` with the filtered snapshot it owns.
 * Cancel `rowan-saved-view-apply` when the application owns that row list.
 * @param {HTMLElement} table
 * @param {import("../table-view-state/table-view-state.js").RowanTableViewState} state
 */
export function applyTableViewState(table, state) {
  if (!isRowanTable(table)) return;
  const view = normalizeTableViewState(state);
  const columns = Array.isArray(table.columns)
    ? table.columns.map((column) => ({ ...column }))
    : [];
  if (columns.length > 0) {
    const byId = new Map(columns.map((column) => [normalizeText(column.id), column]));
    const ordered = [];
    if (Array.isArray(view.columnOrder)) {
      for (const id of view.columnOrder) {
        const column = byId.get(id);
        if (!column) continue;
        ordered.push(column);
        byId.delete(id);
      }
    }
    for (const column of columns) {
      const id = normalizeText(column.id);
      if (byId.has(id)) ordered.push(column);
    }
    const visible = Array.isArray(view.visibleColumns) ? new Set(view.visibleColumns) : null;
    table.columns = ordered.map((column) =>
      visible ? { ...column, hidden: !visible.has(normalizeText(column.id)) } : column,
    );
  }

  clearColumnWidths(table);
  if (view.columnWidths) {
    for (const [id, width] of Object.entries(view.columnWidths)) setColumnWidth(table, id, width);
  }

  const builder = findTableFilterBuilder(table);
  if (builder) builder.filters = view.filters;
  else table.filters = view.filters;
  table.sort = view.sort;
  table.density = view.density;
  table.groupBy = view.groupBy;
  table.page = view.page;
  if (table.dataMode === "server" && view.page) {
    const page = { ...view.page };
    // Filter and sort changes reset the server request to page 0, then wait
    // out the source debounce before getRows. Restore the saved page first.
    setTimeout(() => {
      if (table.isConnected) table.page = page;
    }, 0);
  }
  table.requestRender();
}

/**
 * Saved views for an operational table: name, list, rename, delete, default, apply, and share.
 * Place it in `rowan-table-toolbar`, or set `saved-views` on the toolbar to mount this element.
 * The menu loads with this module, not with the table's initial graph.
 * @tag rowan-saved-views
 * @attr {string} for-table
 * @attr {string} storage-key - Suffix of the storage key. The full key is `rowan-saved-views:` plus this value, the table id, or `default`.
 * @attr {string} label
 * @attr {"on"|"off"} share - Read and write the view query param. Default `on`.
 * @attr {string} share-param - Query key for a shared view. Default `view`.
 * @property {RowanSavedViewStorage | null} storage - Property-only persistence adapter. Defaults to localStorage.
 * @property {RowanSavedView[]} views - Property-only saved views.
 * @property {RowanSavedViewsMessages} messages - Property-only built-in message overrides.
 * @slot actions - Extra controls inside the views menu
 * @csspart root
 * @csspart menu
 * @csspart panel
 * @csspart save-form
 * @csspart name-input
 * @csspart save-button
 * @csspart list
 * @csspart empty
 * @csspart error
 * @csspart status
 * @event rowan-saved-views-change - Fired when the saved list loads or changes
 * @event rowan-saved-view-apply - Cancelable. Fired before a view is written onto the table.
 * @event rowan-saved-view-share - Fired after a share link is copied
 */
export class RowanSavedViews extends BaseElement {
  static styles = componentStyles;
  static observedAttributes = ["for-table", "storage-key", "label", "share", "share-param"];
  static upgradeProperties = [
    "table",
    "forTable",
    "storageKey",
    "label",
    "share",
    "shareParam",
    "storage",
    "messages",
  ];

  #tableOverride = null;
  #boundTable = null;
  #tableAvailabilityCleanup = null;
  #storageAdapter = null;
  #messages = {};
  #store = null;
  #unsubscribe = null;
  #views = [];
  #bootToken = 0;
  #booted = false;
  #root = null;
  #list = null;
  #empty = null;
  #error = null;
  #status = null;
  #nameInput = null;
  #confirmDeleteId = "";
  #renamingId = "";
  #pendingApply = null;
  #onPopState = () => {
    this.#applyFromUrl();
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("popstate", this.#onPopState);
    this.#syncTable();
    void this.#boot();
  }

  disconnectedCallback() {
    window.removeEventListener("popstate", this.#onPopState);
    this.#unsubscribe?.();
    this.#unsubscribe = null;
    this.#tableAvailabilityCleanup?.();
    this.#tableAvailabilityCleanup = null;
    super.disconnectedCallback();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue) return;
    if (name === "for-table") this.#syncTable();
    if (name === "storage-key" || name === "for-table") void this.#boot();
  }

  /** @returns {HTMLElement | null} */
  get table() {
    return this.#boundTable;
  }

  /** @param {HTMLElement | null} value */
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

  get storageKey() {
    return this.readString("storage-key", "").trim();
  }

  set storageKey(value) {
    const next = normalizeText(value);
    this.reflectString("storage-key", next || null);
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

  /** @returns {"on" | "off"} */
  get share() {
    const value = this.readString("share", "on");
    return SHARE_MODES.has(value) ? value : "on";
  }

  /** @param {"on" | "off"} value */
  set share(value) {
    const next = value === "off" ? "off" : "on";
    this.reflectString("share", next === "on" ? null : "off");
  }

  get shareParam() {
    return normalizeText(this.readString("share-param", "")) || "view";
  }

  set shareParam(value) {
    const next = normalizeText(value);
    this.reflectString("share-param", next && next !== "view" ? next : null);
  }

  /** @returns {RowanSavedViewStorage | null} */
  get storage() {
    return this.#storageAdapter;
  }

  /** @param {RowanSavedViewStorage | null | undefined} value */
  set storage(value) {
    this.#storageAdapter =
      value && typeof value.load === "function" && typeof value.save === "function" ? value : null;
    void this.#boot();
  }

  /** @returns {RowanSavedView[]} */
  get views() {
    return cloneViews(this.#views);
  }

  /** @returns {RowanSavedViewsMessages} */
  get messages() {
    return { ...this.#messages };
  }

  /** @param {RowanSavedViewsMessages | null | undefined} value */
  set messages(value) {
    this.#messages = normalizeMessages(value, DEFAULT_MESSAGES);
    this.requestRender();
  }

  /**
   * @param {string} name
   * @returns {Promise<{ ok: boolean, code: string, view: RowanSavedView | null, views: RowanSavedView[] }>}
   */
  save(name) {
    return this.#saveNamed(name);
  }

  /** @param {string} id @param {string} name */
  rename(id, name) {
    return this.#mutate(() => this.#activeStore().rename(id, name), "rename");
  }

  /** @param {string} id */
  delete(id) {
    return this.#mutate(() => this.#activeStore().delete(id), "delete");
  }

  /**
   * Marks one view as the default, or clears the default when `id` is empty.
   * @param {string | null} id
   */
  setDefault(id) {
    return this.#mutate(() => this.#activeStore().setDefault(id), "default");
  }

  /** @param {string} id */
  apply(id) {
    const view = this.#views.find((item) => item.id === id);
    if (!view) return false;
    return this.#requestApply(view.state, view, "user");
  }

  /**
   * Copies a URL for one saved view, or for the current table when `id` is omitted.
   * @param {string} [id]
   */
  copyLink(id) {
    const view = id ? this.#views.find((item) => item.id === id) : null;
    const state = view ? view.state : captureTableViewState(this.#boundTable);
    return this.#copyState(state, view);
  }

  render() {
    if (!this.#root) {
      this.renderRoot.innerHTML = `
        <div class="saved-views" part="root">
          <rowan-dropdown class="menu" part="menu">
            <div class="panel" part="panel">
              <form class="save-form" part="save-form">
                <label class="name-label">
                  <span class="name-text"></span>
                  <input class="name-input" part="name-input" name="view-name" type="text" maxlength="${SAVED_VIEW_NAME_MAX}" autocomplete="off" />
                </label>
                <button class="save-button" part="save-button" type="submit"></button>
              </form>
              <p class="error" part="error" role="alert" hidden></p>
              <div class="list" part="list" role="list"></div>
              <p class="empty" part="empty" hidden></p>
              <button class="copy-current" type="button" data-action="copy-current"></button>
              <div class="actions"><slot name="actions"></slot></div>
            </div>
          </rowan-dropdown>
          <span class="status" part="status" aria-live="polite"></span>
        </div>
      `;
      this.#root = this.renderRoot.querySelector(".saved-views");
      this.#list = this.renderRoot.querySelector(".list");
      this.#empty = this.renderRoot.querySelector(".empty");
      this.#error = this.renderRoot.querySelector(".error");
      this.#status = this.renderRoot.querySelector(".status");
      this.#nameInput = this.renderRoot.querySelector(".name-input");
      this.listen(this.renderRoot.querySelector("form"), "submit", (event) => {
        event.preventDefault();
        void this.#saveNamed(this.#nameInput.value);
      });
      this.listen(this.#list, "click", (event) => this.#onListClick(event));
      this.listen(this.#list, "keydown", (event) => this.#onListKeyDown(event));
      this.listen(this.renderRoot.querySelector("[data-action='copy-current']"), "click", () => {
        void this.copyLink();
      });
    }

    const dropdown = this.renderRoot.querySelector("rowan-dropdown");
    dropdown.label = this.label;
    this.renderRoot.querySelector(".name-text").textContent = resolveMessage(
      this.#messages,
      DEFAULT_MESSAGES,
      "nameLabel",
    );
    this.#nameInput.setAttribute(
      "aria-label",
      resolveMessage(this.#messages, DEFAULT_MESSAGES, "nameLabel"),
    );
    this.renderRoot.querySelector(".save-button").textContent = resolveMessage(
      this.#messages,
      DEFAULT_MESSAGES,
      "save",
    );
    const copyCurrent = this.renderRoot.querySelector("[data-action='copy-current']");
    copyCurrent.hidden = this.share !== "on";
    copyCurrent.textContent = resolveMessage(this.#messages, DEFAULT_MESSAGES, "copyLink");
    this.#empty.textContent = resolveMessage(this.#messages, DEFAULT_MESSAGES, "empty");
    this.#empty.hidden = this.#views.length > 0;
    this.#list.hidden = this.#views.length === 0;
    this.#list.setAttribute("aria-label", this.label);
    this.#renderViews();
  }

  #storageKey() {
    return `rowan-saved-views:${this.storageKey || this.forTable || this.#boundTable?.id || "default"}`;
  }

  #activeStore() {
    const key = this.#storageKey();
    const storage = this.#storageAdapter ?? createLocalStorageSavedViewStorage();
    if (!this.#store || this.#store.key !== key || this.#store.storage !== storage) {
      this.#unsubscribe?.();
      this.#store = createSavedViewStore({ key, storage });
      this.#unsubscribe = this.#store.subscribe((detail) => {
        this.#views = detail.views;
        this.requestRender();
        emit(this, "rowan-saved-views-change", detail);
      });
    }
    return this.#store;
  }

  async #boot() {
    const token = ++this.#bootToken;
    const store = this.#activeStore();
    const views = await store.list();
    if (token !== this.#bootToken || !this.isConnected) return;
    this.#views = views;
    this.requestRender();
    emit(this, "rowan-saved-views-change", { views: cloneViews(views), reason: "load" });
    if (this.#booted) return;
    this.#booted = true;
    if (this.share === "on" && this.#applyFromUrl()) return;
    const fallback = views.find((view) => view.isDefault);
    if (fallback) this.#requestApply(fallback.state, fallback, "default");
  }

  #syncTable() {
    const next = resolveRowanTable(this, this.#tableOverride, this.forTable);
    if (next === this.#boundTable) {
      if (!next) this.#observeTable();
      return;
    }
    this.#boundTable = next;
    if (!next) {
      this.#observeTable();
      return;
    }
    this.#tableAvailabilityCleanup?.();
    this.#tableAvailabilityCleanup = null;
    if (this.#pendingApply) {
      const pending = this.#pendingApply;
      this.#pendingApply = null;
      this.#requestApply(pending.state, pending.view, pending.source);
    }
  }

  #observeTable() {
    if (this.#tableAvailabilityCleanup) return;
    this.#tableAvailabilityCleanup = observeTableAvailability(
      this,
      () => this.forTable,
      () => {
        this.#tableAvailabilityCleanup = null;
        this.#syncTable();
      },
    );
  }

  #message(key, params) {
    return resolveMessage(this.#messages, DEFAULT_MESSAGES, key, params);
  }

  #announce(text) {
    if (this.#status) this.#status.textContent = text;
  }

  #showError(text) {
    if (!this.#error) return;
    this.#error.hidden = !text;
    this.#error.textContent = text;
  }

  #codeMessage(code, name = "") {
    if (code === "empty-name") return this.#message("emptyName");
    if (code === "duplicate-name") return this.#message("duplicateName", { name });
    if (code === "name-too-long")
      return this.#message("nameTooLong", { max: String(SAVED_VIEW_NAME_MAX) });
    if (code === "missing-view") return this.#message("missingView");
    return this.#message("saveFailed");
  }

  async #saveNamed(name) {
    if (!this.#boundTable) {
      this.#showError(this.#message("noTable"));
      return result(false, "missing-view", null, this.#views);
    }
    this.#showError("");
    const saved = await this.#activeStore().save({
      name,
      state: captureTableViewState(this.#boundTable),
    });
    if (!saved.ok) {
      this.#showError(this.#codeMessage(saved.code, normalizeText(name)));
      return saved;
    }
    if (this.#nameInput) this.#nameInput.value = "";
    this.#announce(this.#message("saved", { name: saved.view.name }));
    return saved;
  }

  async #mutate(run, reason) {
    const saved = await run();
    if (!saved.ok) {
      this.#showError(this.#codeMessage(saved.code, saved.view?.name ?? ""));
      return saved;
    }
    this.#showError("");
    if (reason === "rename") this.#announce(this.#message("renamed", { name: saved.view.name }));
    if (reason === "delete") this.#announce(this.#message("deleted", { name: saved.view.name }));
    if (reason === "default" && saved.view) {
      this.#announce(this.#message("defaultSet", { name: saved.view.name }));
    }
    return saved;
  }

  #requestApply(state, view, source) {
    if (!this.#boundTable) {
      this.#pendingApply = { state, view, source };
      this.#syncTable();
      return false;
    }
    const allowed = emit(
      this,
      "rowan-saved-view-apply",
      { view, state: normalizeTableViewState(state), source },
      { cancelable: true },
    );
    if (!allowed) return false;
    applyTableViewState(this.#boundTable, state);
    if (source !== "url" && this.share === "on") this.#writeShare(state);
    if (view) this.#announce(this.#message("applied", { name: view.name }));
    return true;
  }

  #applyFromUrl() {
    if (this.share !== "on") return false;
    const read = readTableViewStateSearch(location.search, this.shareParam);
    if (!read.ok) return false;
    return this.#requestApply(read.state, null, "url");
  }

  #shareUrl(state) {
    const search = writeTableViewStateSearch(state, {
      param: this.shareParam,
      search: location.search,
    });
    const url = new URL(location.href);
    url.search = search;
    return url.toString();
  }

  #writeShare(state) {
    const url = this.#shareUrl(state);
    history.replaceState(history.state, "", url);
    return url;
  }

  async #copyState(state, view) {
    if (this.share !== "on") return false;
    const url = this.#writeShare(state);
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        copied = true;
      }
    } catch {
      copied = false;
    }
    if (!copied) {
      try {
        const area = document.createElement("textarea");
        area.value = url;
        area.setAttribute("readonly", "");
        this.renderRoot.append(area);
        area.select();
        copied = document.execCommand("copy");
        area.remove();
      } catch {
        copied = false;
      }
    }
    this.#announce(this.#message(copied ? "copied" : "copyFailed"));
    if (copied)
      emit(this, "rowan-saved-view-share", { url, view, state: normalizeTableViewState(state) });
    return copied;
  }

  #renderViews() {
    if (!this.#list) return;
    const activeId = this.#renamingId;
    this.#list.replaceChildren(
      ...this.#views.map((view) => {
        const row = document.createElement("div");
        row.className = "view";
        row.dataset.viewId = view.id;
        row.setAttribute("role", "listitem");

        if (activeId === view.id) {
          const input = document.createElement("input");
          input.className = "name-input";
          input.type = "text";
          input.value = view.name;
          input.maxLength = SAVED_VIEW_NAME_MAX;
          input.setAttribute("aria-label", this.#message("rename", { name: view.name }));
          input.dataset.action = "rename-input";
          input.dataset.viewId = view.id;
          row.append(input);
        } else {
          const apply = document.createElement("button");
          apply.type = "button";
          apply.className = "apply";
          apply.dataset.action = "apply";
          apply.dataset.viewId = view.id;
          apply.textContent = view.name;
          apply.setAttribute("aria-label", this.#message("applyLabel", { name: view.name }));
          row.append(apply);
        }

        if (view.isDefault) {
          const badge = document.createElement("span");
          badge.className = "default-badge";
          badge.textContent = this.#message("defaultBadge");
          row.append(badge);
        }

        row.append(
          this.#iconButton("rename", view, "rename"),
          this.#iconButton("default", view, "setDefault", view.isDefault),
          this.#iconButton(
            this.#confirmDeleteId === view.id ? "confirm-delete" : "delete",
            view,
            this.#confirmDeleteId === view.id ? "confirmDelete" : "delete",
          ),
        );
        if (this.share === "on") row.append(this.#iconButton("copy", view, "copyViewLink"));
        return row;
      }),
    );

    const input = this.#list.querySelector("[data-action='rename-input']");
    if (input instanceof HTMLInputElement) {
      input.focus();
      input.select();
    }
  }

  #iconButton(action, view, messageKey, pressed = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "icon-action";
    button.dataset.action = action;
    button.dataset.viewId = view.id;
    button.textContent =
      action === "rename"
        ? "Rename"
        : action === "default"
          ? "Default"
          : action === "copy"
            ? "Link"
            : action === "confirm-delete"
              ? "Confirm"
              : "Delete";
    button.setAttribute("aria-label", this.#message(messageKey, { name: view.name }));
    if (action === "default") button.setAttribute("aria-pressed", pressed ? "true" : "false");
    return button;
  }

  #onListClick(event) {
    const control = event.target.closest("[data-action]");
    if (!control) return;
    const id = control.dataset.viewId ?? "";
    const action = control.dataset.action;
    if (action === "apply") {
      this.#confirmDeleteId = "";
      this.apply(id);
      return;
    }
    if (action === "rename") {
      this.#confirmDeleteId = "";
      this.#renamingId = id;
      this.requestRender();
      return;
    }
    if (action === "default") {
      const view = this.#views.find((item) => item.id === id);
      void this.setDefault(view?.isDefault ? null : id);
      return;
    }
    if (action === "delete") {
      this.#confirmDeleteId = id;
      this.requestRender();
      return;
    }
    if (action === "confirm-delete") {
      this.#confirmDeleteId = "";
      void this.delete(id);
      return;
    }
    if (action === "copy") void this.copyLink(id);
  }

  #onListKeyDown(event) {
    const input = event.target.closest("[data-action='rename-input']");
    if (input) {
      if (event.key === keys.ENTER) {
        event.preventDefault();
        const id = input.dataset.viewId;
        const name = input.value;
        this.#renamingId = "";
        void this.rename(id, name);
      } else if (event.key === keys.ESCAPE) {
        event.preventDefault();
        this.#renamingId = "";
        this.requestRender();
      }
      return;
    }

    if (event.key === keys.ESCAPE && this.#confirmDeleteId) {
      this.#confirmDeleteId = "";
      this.requestRender();
      return;
    }

    const buttons = [...this.#list.querySelectorAll("[data-action='apply']")];
    const index = buttons.indexOf(event.target);
    if (index < 0) return;
    let next = index;
    if (event.key === keys.ARROW_DOWN) next = Math.min(buttons.length - 1, index + 1);
    else if (event.key === keys.ARROW_UP) next = Math.max(0, index - 1);
    else if (event.key === keys.HOME) next = 0;
    else if (event.key === keys.END) next = buttons.length - 1;
    else return;
    event.preventDefault();
    buttons[next]?.focus();
  }
}

define("rowan-saved-views", RowanSavedViews);
