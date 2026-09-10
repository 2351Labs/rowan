import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

const FILE_STATUSES = new Set(["queued", "uploading", "success", "failed"]);

function normalizeStatus(value) {
  const next = String(value ?? "").trim().toLowerCase();
  return FILE_STATUSES.has(next) ? next : "queued";
}

function normalizeProgress(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.min(100, Math.max(0, Math.round(numeric)));
}

function formatBytes(bytesValue) {
  const bytes = Number(bytesValue);
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  if (bytes < 1024) return `${Math.round(bytes)} B`;

  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded} ${units[index]}`;
}

/**
 * Upload queue item showing file metadata, state, and actions.
 * @tag rowan-file-item
 * @attr {string} file-id
 * @attr {string} filename
 * @attr {number} filesize
 * @attr {"queued"|"uploading"|"success"|"failed"} status
 * @attr {number} progress
 * @attr {boolean} disabled
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
  static observedAttributes = ["file-id", "filename", "filesize", "status", "progress", "disabled"];
  static upgradeProperties = ["fileId", "filename", "filesize", "status", "progress", "disabled"];

  #nameEl = null;
  #detailsEl = null;
  #statusEl = null;
  #progressEl = null;
  #retryButton = null;
  #cancelButton = null;
  #removeButton = null;

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

  get status() {
    return normalizeStatus(this.readString("status", "queued"));
  }

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
            <button type="button" class="action" data-action="retry">Retry</button>
            <button type="button" class="action" data-action="cancel">Cancel</button>
            <button type="button" class="action" data-action="remove">Remove</button>
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

    const filename = this.filename || "Untitled file";
    const status = this.status;
    const progress = this.progress;

    this.#nameEl.textContent = filename;
    this.#detailsEl.textContent = formatBytes(this.filesize);
    this.#statusEl.textContent = status.charAt(0).toUpperCase() + status.slice(1);

    const showProgress = status === "uploading";
    this.#progressEl.hidden = !showProgress;
    this.#progressEl.value = progress;

    if (showProgress) {
      this.#progressEl.setAttribute("aria-label", `Upload progress ${progress}%`);
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