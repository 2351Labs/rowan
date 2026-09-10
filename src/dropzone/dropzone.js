import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";

let dropzoneId = 0;

function normalizeFileArray(files) {
  if (!files) return [];
  const list = Array.from(files);
  return list.filter((file) => file instanceof File);
}

/**
 * Drag-and-drop file selection surface with picker fallback.
 * @tag rowan-dropzone
 * @attr {string} label
 * @attr {string} description
 * @attr {string} accept
 * @attr {boolean} multiple
 * @attr {boolean} disabled
 * @attr {boolean} drag-active
 * @csspart surface
 * @csspart label
 * @csspart description
 * @csspart input
 * @event rowan-files-add - Fired when files are selected by picker or drop
 */
export class RowanDropzone extends BaseElement {
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./dropzone.css", import.meta.url).href;
  static observedAttributes = ["label", "description", "accept", "multiple", "disabled", "drag-active"];
  static upgradeProperties = ["label", "description", "accept", "multiple", "disabled", "dragActive"];

  #surface = null;
  #labelEl = null;
  #descriptionEl = null;
  #input = null;
  #inputId = "";

  connectedCallback() {
    super.connectedCallback();

    if (!this.id) {
      dropzoneId += 1;
      this.id = `rowan-dropzone-${dropzoneId}`;
    }

    this.#inputId = `${this.id}__input`;
    this.#applyDefaultA11y();
  }

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    const next = String(value ?? "").trim();
    this.reflectString("label", next || null);
  }

  get description() {
    return this.readString("description", "");
  }

  set description(value) {
    const next = String(value ?? "");
    this.reflectString("description", next || null);
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

  get dragActive() {
    return this.readBoolean("drag-active");
  }

  set dragActive(value) {
    this.reflectBoolean("drag-active", Boolean(value));
  }

  openPicker() {
    if (this.disabled || !this.#input) return;
    this.#input.click();
  }

  render() {
    if (!this.#surface) {
      this.renderRoot.innerHTML = `
        <div class="surface" part="surface" data-part="surface" tabindex="0">
          <p class="label" part="label"></p>
          <p class="description" part="description"></p>
          <slot></slot>
        </div>
        <input class="input" part="input" type="file" hidden />
      `;

      this.#surface = this.renderRoot.querySelector(".surface");
      this.#labelEl = this.renderRoot.querySelector(".label");
      this.#descriptionEl = this.renderRoot.querySelector(".description");
      this.#input = this.renderRoot.querySelector("input");

      this.listen(this.#surface, "click", () => {
        this.openPicker();
      });

      this.listen(this.#surface, "keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        this.openPicker();
      });

      this.listen(this.#input, "change", () => {
        if (this.disabled) return;

        const files = normalizeFileArray(this.#input.files);
        this.#input.value = "";
        this.#emitFiles(files, "picker");
      });

      this.listen(this.#surface, "dragenter", (event) => {
        if (this.disabled) return;
        event.preventDefault();
        this.dragActive = true;
      });

      this.listen(this.#surface, "dragover", (event) => {
        if (this.disabled) return;
        event.preventDefault();
        this.dragActive = true;
      });

      this.listen(this.#surface, "dragleave", (event) => {
        if (this.disabled) return;
        event.preventDefault();
        this.dragActive = false;
      });

      this.listen(this.#surface, "drop", (event) => {
        event.preventDefault();

        if (this.disabled) {
          this.dragActive = false;
          return;
        }

        this.dragActive = false;
        const files = normalizeFileArray(event.dataTransfer?.files);
        this.#emitFiles(files, "drop");
      });
    }

    this.#input.id = this.#inputId;
    this.#input.accept = this.accept;
    this.#input.multiple = this.multiple;
    this.#input.disabled = this.disabled;

    const labelText = this.label || "Drop files here or click to browse";
    const descriptionText = this.description || "Supports drag and drop or standard file picker.";

    this.#labelEl.textContent = labelText;
    this.#descriptionEl.textContent = descriptionText;

    this.#surface.classList.toggle("drag-active", this.dragActive);
    this.#surface.tabIndex = this.disabled ? -1 : 0;
    this.#surface.setAttribute("aria-disabled", this.disabled ? "true" : "false");

    this.#applyDefaultA11y();
  }

  #emitFiles(files, source) {
    if (!Array.isArray(files) || files.length === 0) return;

    emit(this, "rowan-files-add", {
      files,
      source,
    });
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "button";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      const label = this.label.trim();
      this.internals.ariaLabel = label || "File upload dropzone";
    }

    if (!this.hasAttribute("aria-disabled") && "ariaDisabled" in this.internals) {
      this.internals.ariaDisabled = this.disabled ? "true" : "false";
    }
  }
}

define("rowan-dropzone", RowanDropzone);