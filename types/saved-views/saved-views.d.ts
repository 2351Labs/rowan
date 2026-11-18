/**
 * In-memory storage adapter. Useful in tests and when the page has no `localStorage`.
 * @param {RowanSavedView[]} [initial]
 * @returns {RowanSavedViewStorage}
 */
export function createMemorySavedViewStorage(
  initial?: RowanSavedView[] | undefined,
): RowanSavedViewStorage;
export function createLocalStorageSavedViewStorage(backend: any): {
  load(key: any): {
    id: string;
    name: string;
    state: any;
    isDefault: boolean;
    updatedAt: number;
  }[];
  save(key: any, views: any): void;
};
/**
 * Named saved views for one table. The store normalizes every state to table-view-state v2.
 * Pass `storage` to persist on a server. The default adapter is `localStorage`.
 * @param {{ key: string, storage?: RowanSavedViewStorage }} options
 */
export function createSavedViewStore(options: { key: string; storage?: RowanSavedViewStorage }): {
  key: string;
  storage: RowanSavedViewStorage;
  list(): Promise<any>;
  get(id: any): Promise<{
    id: any;
    name: any;
    state: any;
    isDefault: boolean;
    updatedAt: any;
  } | null>;
  /**
   * @param {{ id?: string, name?: string, state?: object }} [input]
   */
  save(
    input?:
      | {
          id?: string | undefined;
          name?: string | undefined;
          state?: object;
        }
      | undefined,
  ): Promise<void>;
  rename(id: any, name: any): Promise<void>;
  delete(id: any): Promise<void>;
  setDefault(id: any): Promise<void>;
  subscribe(listener: any): () => void;
};
/**
 * Reads the filter builder inside a table, when one is slotted there.
 * @param {HTMLElement | null | undefined} table
 * @returns {HTMLElement | null}
 */
export function findTableFilterBuilder(table: HTMLElement | null | undefined): HTMLElement | null;
/**
 * Captures the public table fields that table-view-state v2 stores.
 * A linked filter builder supplies the filter tree. Quick find is not included.
 * @param {HTMLElement | null | undefined} table
 * @returns {import("../table-view-state/table-view-state.js").RowanTableViewState}
 */
export function captureTableViewState(table: HTMLElement | null | undefined): any;
/**
 * Assigns a version 2 view onto a table and its filter builder.
 * Page is applied last because server sort and filter changes reset it.
 * In client mode the filter builder replaces `rows` with the filtered snapshot it owns.
 * Cancel `rowan-saved-view-apply` when the application owns that row list.
 * @param {HTMLElement} table
 * @param {import("../table-view-state/table-view-state.js").RowanTableViewState} state
 */
export function applyTableViewState(table: HTMLElement, state: any): void;
/** Maximum saved-view name length, after trimming and collapsing whitespace. */
export const SAVED_VIEW_NAME_MAX: 80;
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
  static styles: string;
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
  /** @param {HTMLElement | null} value */
  set table(value: HTMLElement | null);
  /** @returns {HTMLElement | null} */
  get table(): HTMLElement | null;
  set forTable(value: string);
  get forTable(): string;
  set storageKey(value: string);
  get storageKey(): string;
  set label(value: string);
  get label(): string;
  /** @param {"on" | "off"} value */
  set share(value: "off" | "on");
  /** @returns {"on" | "off"} */
  get share(): "off" | "on";
  set shareParam(value: string);
  get shareParam(): string;
  /** @param {RowanSavedViewStorage | null | undefined} value */
  set storage(value: RowanSavedViewStorage | null);
  /** @returns {RowanSavedViewStorage | null} */
  get storage(): RowanSavedViewStorage | null;
  /** @returns {RowanSavedView[]} */
  get views(): RowanSavedView[];
  /** @param {RowanSavedViewsMessages | null | undefined} value */
  set messages(value: RowanSavedViewsMessages | null | undefined);
  /** @returns {RowanSavedViewsMessages} */
  get messages(): RowanSavedViewsMessages;
  /**
   * @param {string} name
   * @returns {Promise<{ ok: boolean, code: string, view: RowanSavedView | null, views: RowanSavedView[] }>}
   */
  save(name: string): Promise<{
    ok: boolean;
    code: string;
    view: RowanSavedView | null;
    views: RowanSavedView[];
  }>;
  /** @param {string} id @param {string} name */
  rename(id: string, name: string): Promise<any>;
  /** @param {string} id */
  delete(id: string): Promise<any>;
  /**
   * Marks one view as the default, or clears the default when `id` is empty.
   * @param {string | null} id
   */
  setDefault(id: string | null): Promise<any>;
  /** @param {string} id */
  apply(id: string): boolean;
  /**
   * Copies a URL for one saved view, or for the current table when `id` is omitted.
   * @param {string} [id]
   */
  copyLink(id?: string | undefined): Promise<boolean>;
  #private;
}
export type RowanSavedView = {
  id: string;
  name: string;
  state: any;
  isDefault: boolean;
  updatedAt: number;
};
export type RowanSavedViewStorage = {
  load: (key: string) => RowanSavedView[] | null | Promise<RowanSavedView[] | null>;
  save: (key: string, views: RowanSavedView[]) => void | Promise<void>;
};
export type RowanSavedViewsMessages = {
  applied?: string | undefined;
  confirmDelete?: string | undefined;
  confirmDeleteAction?: string | undefined;
  applyLabel?: string | undefined;
  copied?: string | undefined;
  copyAction?: string | undefined;
  copyFailed?: string | undefined;
  defaultAction?: string | undefined;
  deleteAction?: string | undefined;
  renameAction?: string | undefined;
  copyLink?: string | undefined;
  copyViewLink?: string | undefined;
  defaultBadge?: string | undefined;
  defaultSet?: string | undefined;
  delete?: string | undefined;
  deleted?: string | undefined;
  duplicateName?: string | undefined;
  empty?: string | undefined;
  emptyName?: string | undefined;
  label?: string | undefined;
  loadFailed?: string | undefined;
  nameLabel?: string | undefined;
  nameTooLong?: string | undefined;
  noTable?: string | undefined;
  missingView?: string | undefined;
  rename?: string | undefined;
  renamed?: string | undefined;
  save?: string | undefined;
  saveFailed?: string | undefined;
  saved?: string | undefined;
  setDefault?: string | undefined;
};
import { BaseElement } from "../lib/base-element.js";
