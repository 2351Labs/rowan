import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { formatNumber } from "../lib/format.js";
import { resolveLocale } from "../lib/locale.js";
import { normalizeMessages, resolveMessage } from "../lib/messages.js";

const FILE_STATUSES = new Set(["queued", "uploading", "success", "failed"]);
const DEFAULT_MESSAGES = Object.freeze({
  cancel: "Cancel",
  fileSize: "{value} {unit}",
  remove: "Remove",
  retry: "Retry",
  statusFailed: "Failed",
  statusQueued: "Queued",
  statusSuccess: "Success",
  statusUploading: "Uploading",
  untitledFile: "Untitled file",
  uploadProgress: "Upload progress {progress}%",
});

function normalizeStatus(value) {
  const next = String(value ?? "")
    .trim()
    .toLowerCase();
  return FILE_STATUSES.has(next) ? next : "queued";
}

function normalizeProgress(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.min(100, Math.max(0, Math.round(numeric)));
}

function formatBytes(bytesValue, locale, messages) {
  const bytes = Number(bytesValue);
  const normalizedBytes = Number.isFinite(bytes) && bytes >= 0 ? bytes : 0;
  if (normalizedBytes < 1024) {
    const value = Math.round(normalizedBytes);
    return resolveMessage(messages, DEFAULT_MESSAGES, "fileSize", {
      bytes: normalizedBytes,
      unit: "B",
      value: formatNumber(value, { locale, fallback: String(value) }),
    });
  }

  const units = ["KB", "MB", "GB", "TB"];
  let value = normalizedBytes / 1024;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
  return resolveMessage(messages, DEFAULT_MESSAGES, "fileSize", {
    bytes: normalizedBytes,
    unit: units[index],
    value: formatNumber(rounded, {
      locale,
      options: { maximumFractionDigits: rounded >= 10 ? 0 : 1 },
      fallback: String(rounded),
    }),
  });
}

/**
 * @typedef {object} RowanFileItemMessages
 * @property {string} [cancel]
 * @property {string | ((context: { bytes: number, unit: string, value: string }) => string)} [fileSize]
 * @property {string} [remove]
 * @property {string} [retry]
 * @property {string} [statusFailed]
 * @property {string} [statusQueued]
 * @property {string} [statusSuccess]
 * @property {string} [statusUploading]
 * @property {string} [untitledFile]
 * @property {string | ((context: { progress: number }) => string)} [uploadProgress]
 */

/**
 * Upload queue item showing file metadata, state, and actions.
 * @tag rowan-file-item
 * @attr {string} file-id
 * @attr {string} filename
 * @attr {number} filesize
 * @attr {"queued"|"uploading"|"success"|"failed"} status
 * @attr {number} progress
 * @attr {boolean} disabled
 * @attr {string} locale
 * @property {RowanFileItemMessages} messages - Property-only built-in message overrides.
 * @csspart item
 * @csspart name
 * @csspart details
 * @csspart status
 * @csspart progress
 * @csspart actions
 * @event rowan-remove - Fired when remove action is clicked
 * @event rowan-retry - Fired when retry action is clicked for failed files
 * @event rowan-cancel - Fired when cancel action is clicked for uploading files
 */
export class RowanFileItem extends BaseElement {
  static useElementInternals = true;
  static styleUrl = new URL("./file-item.css", import.meta.url).href;
  static observedAttributes = [
    "file-id",
    "filename",
    "filesize",
    "status",
    "progress",
    "disabled",
    "locale",
  ];
  static upgradeProperties = [
    "fileId",
    "filename",
    "filesize",
    "status",
    "progress",
    "disabled",
    "locale",
    "messages",
  ];

  #nameEl = null;
  #detailsEl = null;
  #statusEl = null;
  #progressEl = null;
  #retryButton = null;
  #cancelButton = null;
  #removeButton = null;
  #messages = {};

  get fileId() {
    return this.readString("file-id", "").trim();
  }

  set fileId(value) {
    const next = String(value ?? "").trim();
    this.reflectString("file-id", next || null);
  }

  get filename() {
    return this.readString("filename", "");
  }

  set filename(value) {
    const next = String(value ?? "");
    this.reflectString("filename", next || null);
  }

  get filesize() {
    const numeric = Number(this.readNumber("filesize", 0));
    if (!Number.isFinite(numeric) || numeric < 0) return 0;
    return Math.round(numeric);
  }

  set filesize(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) {
      this.reflectNumber("filesize", null);
      return;
    }

    this.reflectNumber("filesize", Math.round(numeric));
  }

  /** @returns {"queued" | "uploading" | "success" | "failed"} */
  get status() {
    return normalizeStatus(this.readString("status", "queued"));
  }

  /** @param {"queued" | "uploading" | "success" | "failed"} value */
  set status(value) {
    this.reflectString("status", normalizeStatus(value));
  }

  get progress() {
    return normalizeProgress(this.readNumber("progress", 0));
  }

  set progress(value) {
    this.reflectNumber("progress", normalizeProgress(value));
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
  }

  get locale() {
    return resolveLocale(this, this.readString("locale", "").trim());
  }

  set locale(value) {
    this.reflectString("locale", value || null);
  }

  /** @returns {RowanFileItemMessages} */
  get messages() {
    return { ...this.#messages };
  }

  /** @param {RowanFileItemMessages | null | undefined} value */
  set messages(value) {
    this.#messages = normalizeMessages(value, DEFAULT_MESSAGES);
    this.requestRender();
  }

  render() {
    if (!this.#nameEl) {
      this.renderRoot.innerHTML = `
        <article class="item" part="item">
          <div class="meta">
            <p class="name" part="name"></p>
            <p class="details" part="details"></p>
          </div>
          <div class="state">
            <span class="status" part="status"></span>
            <progress class="progress" part="progress" max="100"></progress>
          </div>
          <div class="actions" part="actions">
            <button type="button" class="action" data-action="retry"></button>
            <button type="button" class="action" data-action="cancel"></button>
            <button type="button" class="action" data-action="remove"></button>
          </div>
        </article>
      `;

      this.#nameEl = this.renderRoot.querySelector(".name");
      this.#detailsEl = this.renderRoot.querySelector(".details");
      this.#statusEl = this.renderRoot.querySelector(".status");
      this.#progressEl = this.renderRoot.querySelector(".progress");
      this.#retryButton = this.renderRoot.querySelector('[data-action="retry"]');
      this.#cancelButton = this.renderRoot.querySelector('[data-action="cancel"]');
      this.#removeButton = this.renderRoot.querySelector('[data-action="remove"]');

      this.listen(this.#retryButton, "click", () => {
        this.#onAction("retry");
      });

      this.listen(this.#cancelButton, "click", () => {
        this.#onAction("cancel");
      });

      this.listen(this.#removeButton, "click", () => {
        this.#onAction("remove");
      });
    }

    const filename =
      this.filename || resolveMessage(this.#messages, DEFAULT_MESSAGES, "untitledFile");
    const status = this.status;
    const progress = this.progress;

    this.#nameEl.textContent = filename;
    this.#detailsEl.textContent = formatBytes(this.filesize, this.locale, this.#messages);
    this.#statusEl.textContent = this.#statusMessage(status);
    this.#retryButton.textContent = resolveMessage(this.#messages, DEFAULT_MESSAGES, "retry");
    this.#cancelButton.textContent = resolveMessage(this.#messages, DEFAULT_MESSAGES, "cancel");
    this.#removeButton.textContent = resolveMessage(this.#messages, DEFAULT_MESSAGES, "remove");

    const showProgress = status === "uploading";
    this.#progressEl.hidden = !showProgress;
    this.#progressEl.value = progress;

    if (showProgress) {
      this.#progressEl.setAttribute(
        "aria-label",
        resolveMessage(this.#messages, DEFAULT_MESSAGES, "uploadProgress", { progress }),
      );
    } else {
      this.#progressEl.removeAttribute("aria-label");
    }

    this.#retryButton.hidden = status !== "failed";
    this.#cancelButton.hidden = status !== "uploading";

    const actionDisabled = this.disabled;
    this.#retryButton.disabled = actionDisabled;
    this.#cancelButton.disabled = actionDisabled;
    this.#removeButton.disabled = actionDisabled;

    this.#applyDefaultA11y();
  }

  #onAction(action) {
    if (this.disabled) return;

    if (action === "retry") {
      if (this.status !== "failed") return;
      emit(this, "rowan-retry", this.#eventDetail());
      return;
    }

    if (action === "cancel") {
      if (this.status !== "uploading") return;
      emit(this, "rowan-cancel", this.#eventDetail());
      return;
    }

    if (action === "remove") {
      emit(this, "rowan-remove", this.#eventDetail());
    }
  }

  #eventDetail() {
    return {
      fileId: this.fileId,
      filename: this.filename,
      filesize: this.filesize,
      status: this.status,
      progress: this.progress,
    };
  }

  #statusMessage(status) {
    const key = `status${status.charAt(0).toUpperCase()}${status.slice(1)}`;
    return resolveMessage(this.#messages, DEFAULT_MESSAGES, key);
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "listitem";
    }

    if (!this.hasAttribute("aria-disabled") && "ariaDisabled" in this.internals) {
      this.internals.ariaDisabled = this.disabled ? "true" : "false";
    }
  }
}

define("rowan-file-item", RowanFileItem);
