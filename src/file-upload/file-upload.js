import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

import "../dropzone/dropzone.js";
import "../file-item/file-item.js";

const FILE_STATUSES = new Set(["queued", "uploading", "success", "failed"]);
let uploadRecordId = 0;

function normalizeStatus(value) {
  const next = String(value ?? "").trim().toLowerCase();
  return FILE_STATUSES.has(next) ? next : "queued";
}

function normalizeProgress(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.min(100, Math.max(0, Math.round(numeric)));
}

function normalizeMaxFiles(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return 0;
  return Math.floor(numeric);
}

function cloneRecord(record) {
  return {
    ...record,
  };
}

function normalizeFromFile(file) {
  uploadRecordId += 1;

  return {
    id: `file-${uploadRecordId}`,
    name: file.name,
    size: file.size,
    type: file.type,
    status: "queued",
    progress: 0,
    file,
  };
}

function normalizeRecord(record) {
  const source = record && typeof record === "object" ? record : {};

  const idText = String(source.id ?? "").trim();
  const id = idText || `file-${++uploadRecordId}`;

  const name = String(source.name ?? source.filename ?? "").trim() || "Untitled file";

  const sizeNumber = Number(source.size ?? source.filesize ?? 0);
  const size = Number.isFinite(sizeNumber) && sizeNumber >= 0 ? Math.round(sizeNumber) : 0;

  return {
    id,
    name,
    size,
    type: String(source.type ?? ""),
    status: normalizeStatus(source.status),
    progress: normalizeProgress(source.progress),
    file: source.file instanceof File ? source.file : null,
  };
}

/**
 * File upload composer with dropzone and queue item rendering.
 * @tag rowan-file-upload
 * @attr {string} label
 * @attr {string} accept
 * @attr {boolean} multiple
 * @attr {boolean} disabled
 * @attr {number} max-files
 * @csspart upload
 * @csspart dropzone
 * @csspart file-list
 * @csspart empty
 * @event rowan-files-add - Fired when files are accepted into the queue
 * @event rowan-file-remove - Fired when a queued file is removed
 * @event rowan-file-retry - Fired when retry is requested for a failed file
 * @event rowan-file-cancel - Fired when cancel is requested for an uploading file
 */
export class RowanFileUpload extends BaseElement {
  static useElementInternals = true;
  static styleUrl = new URL("./file-upload.css", import.meta.url).href;
  static observedAttributes = ["label", "accept", "multiple", "disabled", "max-files"];
  static upgradeProperties = ["label", "accept", "multiple", "disabled", "maxFiles", "files"];

  #dropzone = null;
  #list = null;
  #empty = null;
  #files = [];

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    const next = String(value ?? "").trim();
    this.reflectString("label", next || null);
  }

  get accept() {
    return this.readString("accept", "").trim();
  }

  set accept(value) {
    const next = String(value ?? "").trim();
    this.reflectString("accept", next || null);
  }

  get multiple() {
    return this.readBoolean("multiple");
  }

  set multiple(value) {
    this.reflectBoolean("multiple", Boolean(value));
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
  }

  get maxFiles() {
    return normalizeMaxFiles(this.readNumber("max-files", 0));
  }

  set maxFiles(value) {
    const maxFiles = normalizeMaxFiles(value);
    this.reflectNumber("max-files", maxFiles || null);
  }

  get files() {
    return this.#files.map((record) => cloneRecord(record));
  }

  set files(value) {
    const items = Array.isArray(value) ? value : [];
    this.#files = items.map((item) => normalizeRecord(item));
    this.requestRender();
  }

  render() {
    if (!this.#dropzone) {
      this.renderRoot.innerHTML = `
        <section class="upload" part="upload">
          <rowan-dropzone part="dropzone"></rowan-dropzone>
          <ul class="file-list" part="file-list"></ul>
          <p class="empty" part="empty"></p>
        </section>
      `;

      this.#dropzone = this.renderRoot.querySelector("rowan-dropzone");
      this.#list = this.renderRoot.querySelector(".file-list");
      this.#empty = this.renderRoot.querySelector(".empty");

      this.listen(this.#dropzone, "rowan-files-add", (event) => {
        event.stopPropagation();

        if (this.disabled) return;

        const source = event.detail?.source === "drop" ? "drop" : "picker";
        this.#acceptFiles(event.detail?.files, source);
      });

      this.listen(this.#list, "rowan-remove", (event) => {
        event.stopPropagation();
        this.#removeFileFromEvent(event);
      });

      this.listen(this.#list, "rowan-retry", (event) => {
        event.stopPropagation();
        this.#retryFileFromEvent(event);
      });

      this.listen(this.#list, "rowan-cancel", (event) => {
        event.stopPropagation();
        this.#cancelFileFromEvent(event);
      });
    }

    this.#dropzone.label = this.label || "Drop files to upload";
    this.#dropzone.description = "or click to browse from your device";
    this.#dropzone.accept = this.accept;
    this.#dropzone.multiple = this.multiple;
    this.#dropzone.disabled = this.disabled;

    this.#renderFileList();
    this.#applyDefaultA11y();
  }

  #renderFileList() {
    this.#list.textContent = "";

    for (const record of this.#files) {
      const listItem = document.createElement("li");
      listItem.className = "row";

      const fileItem = document.createElement("rowan-file-item");
      fileItem.setAttribute("data-file-id", record.id);
      fileItem.fileId = record.id;
      fileItem.filename = record.name;
      fileItem.filesize = record.size;
      fileItem.status = record.status;
      fileItem.progress = record.progress;
      fileItem.disabled = this.disabled;

      listItem.append(fileItem);
      this.#list.append(listItem);
    }

    const hasFiles = this.#files.length > 0;
    this.#empty.hidden = hasFiles;
    this.#empty.textContent = hasFiles ? "" : "No files selected.";
  }

  #acceptFiles(files, source) {
    const incoming = Array.isArray(files) ? files.filter((file) => file instanceof File) : [];
    if (incoming.length === 0) return;

    const candidates = this.multiple ? incoming : incoming.slice(0, 1);
    const maxFiles = this.maxFiles;
    const remaining = maxFiles > 0 ? Math.max(0, maxFiles - this.#files.length) : Number.POSITIVE_INFINITY;
    const accepted = Number.isFinite(remaining) ? candidates.slice(0, remaining) : candidates;

    if (accepted.length === 0) return;

    const normalized = accepted.map((file) => normalizeFromFile(file));
    this.#files = [...this.#files, ...normalized];
    this.requestRender();

    emit(this, "rowan-files-add", {
      files: normalized.map((record) => cloneRecord(record)),
      source,
      total: this.#files.length,
    });
  }

  #resolveFileIdFromEvent(event) {
    const fromDetail = String(event.detail?.fileId ?? "").trim();
    if (fromDetail) return fromDetail;

    const target = event.target;
    if (target instanceof HTMLElement) {
      const fromData = String(target.getAttribute("data-file-id") ?? "").trim();
      if (fromData) return fromData;
    }

    return "";
  }

  #removeFileFromEvent(event) {
    const fileId = this.#resolveFileIdFromEvent(event);
    if (!fileId) return;

    const index = this.#files.findIndex((file) => file.id === fileId);
    if (index === -1) return;

    const [removed] = this.#files.splice(index, 1);
    this.#files = [...this.#files];
    this.requestRender();

    emit(this, "rowan-file-remove", {
      file: cloneRecord(removed),
      files: this.files,
    });
  }

  #retryFileFromEvent(event) {
    const fileId = this.#resolveFileIdFromEvent(event);
    if (!fileId) return;

    const index = this.#files.findIndex((file) => file.id === fileId);
    if (index === -1) return;

    const current = this.#files[index];
    if (current.status !== "failed") return;

    const next = {
      ...current,
      status: "queued",
      progress: 0,
    };

    this.#files[index] = next;
    this.#files = [...this.#files];
    this.requestRender();

    emit(this, "rowan-file-retry", {
      file: cloneRecord(next),
      files: this.files,
    });
  }

  #cancelFileFromEvent(event) {
    const fileId = this.#resolveFileIdFromEvent(event);
    if (!fileId) return;

    const index = this.#files.findIndex((file) => file.id === fileId);
    if (index === -1) return;

    const current = this.#files[index];
    if (current.status !== "uploading") return;

    const next = {
      ...current,
      status: "failed",
    };

    this.#files[index] = next;
    this.#files = [...this.#files];
    this.requestRender();

    emit(this, "rowan-file-cancel", {
      file: cloneRecord(next),
      files: this.files,
    });
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "group";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      const label = this.label.trim();
      this.internals.ariaLabel = label || "File upload";
    }

    if (!this.hasAttribute("aria-disabled") && "ariaDisabled" in this.internals) {
      this.internals.ariaDisabled = this.disabled ? "true" : "false";
    }
  }
}

define("rowan-file-upload", RowanFileUpload);