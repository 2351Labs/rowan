import { BaseElement } from "../lib/base-element.js";
import { define } from "../lib/define.js";
import { emit } from "../lib/events.js";
import { validityMessage } from "../lib/validity-messages.js";
import {
  cloneDocument,
  documentFromEditingSurface,
  documentFromPlainText,
  documentToPlainText,
  isDocumentEmpty,
  normalizeDocument,
  normalizeHref,
  parseStoredDocument,
  renderDocument,
  serializeDocument,
} from "./document.js";

let richTextEditorId = 0;

const MARK_COMMANDS = new Set([
  "bold",
  "italic",
  "underline",
  "insertUnorderedList",
  "insertOrderedList",
]);

function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeMode(value) {
  return normalizeText(value).toLowerCase() === "plain" ? "plain" : "rich";
}

/**
 * Constrained form-associated authoring control with a property-only document value.
 *
 * The rich mode supports paragraphs, headings (levels 1–3), ordered and unordered
 * lists, plus bold, italic, underline, and allowlisted links. Values are normalized
 * to a safe document object; HTML is never accepted as an API value. Images are not
 * document nodes. Rich clipboard data is inserted as plain text.
 *
 * @tag rowan-rich-text-editor
 * @attr {string} name
 * @attr {string} label
 * @attr {string} description
 * @attr {string} placeholder
 * @attr {"rich"|"plain"} mode
 * @attr {boolean} disabled
 * @attr {boolean} required
 * @attr {boolean} invalid
 * @property {import("./document.js").RowanRichTextDocument} value - Rich document state. Objects are property-only.
 * @property {string} text - Plain-text convenience value. Property-only.
 * @slot label - Replaces the label attribute.
 * @slot description - Replaces the description attribute.
 * @csspart control
 * @csspart label
 * @csspart description
 * @csspart toolbar
 * @csspart format-button
 * @csspart editor
 * @csspart plain-text
 * @cssprop --rowan-rich-text-editor-bg
 * @cssprop --rowan-rich-text-editor-border
 * @cssprop --rowan-rich-text-editor-toolbar-bg
 * @event rowan-change - Fired when a user changes the normalized document.
 */
export class RowanRichTextEditor extends BaseElement {
  static formAssociated = true;
  static useElementInternals = true;
  static shadowRootOptions = { mode: "open", delegatesFocus: true };
  static styleUrl = new URL("./rich-text-editor.css", import.meta.url).href;
  static componentTokenPrefixes = ["--rowan-rich-text-editor-"];
  static observedAttributes = [
    "name",
    "label",
    "description",
    "placeholder",
    "mode",
    "disabled",
    "required",
    "invalid",
  ];
  static upgradeProperties = [
    "name",
    "label",
    "description",
    "placeholder",
    "mode",
    "disabled",
    "required",
    "invalid",
    "value",
    "text",
  ];

  #control = null;
  #heading = null;
  #labelFallback = null;
  #labelSlot = null;
  #descriptionFallback = null;
  #descriptionSlot = null;
  #toolbar = null;
  #editorSlot = null;
  #editorPlaceholder = null;
  #editor = null;
  #removeEditorListeners = [];
  #textarea = null;
  #value = { blocks: [] };
  #defaultValue = null;
  #renderedValue = "";
  #renderedMode = "";
  #savedRange = null;
  #linkPopover = null;
  #linkHrefInput = null;
  #labelId = "";
  #descriptionId = "";

  connectedCallback() {
    super.connectedCallback();
    this.#ensureEditor();

    if (this.#defaultValue === null) {
      this.#defaultValue = cloneDocument(this.#value);
    }

    if (!this.id) {
      richTextEditorId += 1;
      this.id = `rowan-rich-text-editor-${richTextEditorId}`;
    }

    this.#labelId = `${this.id}__label`;
    this.#descriptionId = `${this.id}__description`;
    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue) return;

    if (["name", "disabled"].includes(name)) this.#syncFormValue();
    if (["disabled", "required", "mode"].includes(name)) this.#syncValidity();
    if (["label", "description", "disabled", "required", "invalid"].includes(name)) {
      this.#applyDefaultA11y();
    }
  }

  get name() {
    return this.readString("name", "");
  }

  set name(value) {
    this.reflectString("name", normalizeText(value) || null);
    this.#syncFormValue();
  }

  get label() {
    return this.readString("label", "");
  }

  set label(value) {
    this.reflectString("label", normalizeText(value) || null);
  }

  get description() {
    return this.readString("description", "");
  }

  set description(value) {
    this.reflectString("description", normalizeText(value) || null);
  }

  get placeholder() {
    return this.readString("placeholder", "");
  }

  set placeholder(value) {
    this.reflectString("placeholder", String(value ?? "") || null);
  }

  get mode() {
    return normalizeMode(this.readString("mode", "rich"));
  }

  set mode(value) {
    const next = normalizeMode(value);
    this.reflectString("mode", next === "rich" ? null : next);
  }

  get disabled() {
    return this.readBoolean("disabled");
  }

  set disabled(value) {
    this.reflectBoolean("disabled", Boolean(value));
    this.#syncFormValue();
    this.#syncValidity();
  }

  get required() {
    return this.readBoolean("required");
  }

  set required(value) {
    this.reflectBoolean("required", Boolean(value));
    this.#syncValidity();
  }

  get invalid() {
    return this.readBoolean("invalid");
  }

  set invalid(value) {
    this.reflectBoolean("invalid", Boolean(value));
  }

  /** @returns {import("./document.js").RowanRichTextDocument} */
  get value() {
    return cloneDocument(this.#value);
  }

  /** @param {import("./document.js").RowanRichTextDocument} value */
  set value(value) {
    this.#assignValue(value, true);
  }

  get text() {
    return documentToPlainText(this.#value);
  }

  set text(value) {
    this.#assignValue(documentFromPlainText(value), true);
  }

  clear() {
    this.value = { blocks: [] };
  }

  focus(options) {
    const target = this.mode === "plain" ? this.#textarea : this.#editor;
    target?.focus(options);
  }

  setFormValue(
    value = this.disabled ? null : serializeDocument(this.#value),
    state = serializeDocument(this.#value),
  ) {
    if (this.internals && typeof this.internals.setFormValue === "function") {
      this.internals.setFormValue(value, state);
    }
  }

  setValidity(flags = {}, message = "", anchor = this.#activeInput()) {
    if (this.internals && typeof this.internals.setValidity === "function") {
      if (anchor instanceof HTMLElement) {
        this.applyValidity(flags, message, anchor);
      } else {
        this.applyValidity(flags, message);
      }
    }
  }

  formResetCallback() {
    this.value = this.#defaultValue ?? { blocks: [] };
  }

  formStateRestoreCallback(state) {
    this.value = state == null ? { blocks: [] } : parseStoredDocument(String(state));
  }

  checkValidity() {
    if (this.internals && typeof this.internals.checkValidity === "function") {
      return this.internals.checkValidity();
    }

    return !this.#isValueMissing();
  }

  reportValidity() {
    if (this.internals && typeof this.internals.reportValidity === "function") {
      return this.internals.reportValidity();
    }

    return this.checkValidity();
  }

  render() {
    if (!this.#control) {
      this.renderRoot.innerHTML = `
        <div class="control" part="control">
          <div class="heading">
            <div class="editor-label" part="label"><slot name="label"><span class="label-fallback"></span></slot></div>
            <div class="description" part="description"><slot name="description"><span class="description-fallback"></span></slot></div>
          </div>
          <div class="toolbar" part="toolbar" role="toolbar">
            <button class="format-button bold" part="format-button" type="button" data-command="bold" aria-label="Bold" title="Bold"><strong aria-hidden="true">B</strong></button>
            <button class="format-button italic" part="format-button" type="button" data-command="italic" aria-label="Italic" title="Italic"><em aria-hidden="true">I</em></button>
            <button class="format-button underline" part="format-button" type="button" data-command="underline" aria-label="Underline" title="Underline"><u aria-hidden="true">U</u></button>
            <span class="toolbar-divider" aria-hidden="true"></span>
            <button class="format-button list" part="format-button" type="button" data-command="insertUnorderedList" aria-label="Bulleted list" title="Bulleted list"><span aria-hidden="true">•</span></button>
            <button class="format-button list" part="format-button" type="button" data-command="insertOrderedList" aria-label="Numbered list" title="Numbered list"><span aria-hidden="true">1.</span></button>
            <span class="toolbar-divider" aria-hidden="true"></span>
            <button class="format-button heading" part="format-button" type="button" data-command="heading" aria-label="Heading" title="Heading"><span aria-hidden="true">H</span></button>
            <button class="format-button link" part="format-button" type="button" data-command="link" aria-haspopup="dialog" aria-expanded="false" aria-label="Link" title="Link"><span aria-hidden="true">↗</span></button>
            <div class="link-popover" popover>
              <label class="link-label">
                URL
                <input class="link-href" type="text" autocomplete="off" spellcheck="false" placeholder="https:// or /path" />
              </label>
              <div class="link-actions">
                <button class="link-apply" type="button" data-link-action="apply">Apply</button>
                <button class="link-remove" type="button" data-link-action="remove">Remove</button>
              </div>
            </div>
          </div>
          <div class="editor-shell">
            <slot class="editor-slot" name="editor-surface"></slot>
            <span class="editor-placeholder" aria-hidden="true"></span>
            <textarea class="plain-text" part="plain-text"></textarea>
          </div>
        </div>
      `;

      this.#control = this.renderRoot.querySelector(".control");
      this.#heading = this.renderRoot.querySelector(".heading");
      this.#labelFallback = this.renderRoot.querySelector(".label-fallback");
      this.#labelSlot = this.renderRoot.querySelector('slot[name="label"]');
      this.#descriptionFallback = this.renderRoot.querySelector(".description-fallback");
      this.#descriptionSlot = this.renderRoot.querySelector('slot[name="description"]');
      this.#toolbar = this.renderRoot.querySelector(".toolbar");
      this.#linkPopover = this.renderRoot.querySelector(".link-popover");
      this.#linkHrefInput = this.renderRoot.querySelector(".link-href");
      this.#editorSlot = this.renderRoot.querySelector(".editor-slot");
      this.#editorPlaceholder = this.renderRoot.querySelector(".editor-placeholder");
      this.#textarea = this.renderRoot.querySelector(".plain-text");

      this.listen(this.#toolbar, "pointerdown", (event) => {
        if (this.#buttonFromEvent(event) || event.target.closest?.("[data-link-action]")) {
          event.preventDefault();
        }
      });
      this.listen(this.#toolbar, "click", (event) => this.#handleToolbarClick(event));
      this.listen(this.#linkPopover, "toggle", (event) => this.#syncLinkPopoverState(event));
      this.listen(this.#linkHrefInput, "keydown", (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        this.#handleLinkAction("apply");
      });
      this.listen(this.#textarea, "input", () => this.#commitPlainTextInput());
      this.listen(this.#labelSlot, "slotchange", () => this.requestRender());
      this.listen(this.#descriptionSlot, "slotchange", () => this.requestRender());
      this.listen(this.#editorSlot, "slotchange", () => this.#ensureEditor());
      this.listen(document, "selectionchange", () => {
        this.#captureSelection();
        this.#syncToolbarState();
      });
    }

    this.#ensureEditor();
    this.#syncLabels();
    this.#syncEditingSurface();
    this.#syncFormValue();
    this.#syncValidity();
    this.#applyDefaultA11y();
  }

  #assignValue(value, shouldRender) {
    const nextValue = normalizeDocument(value);
    const changed = serializeDocument(nextValue) !== serializeDocument(this.#value);
    this.#value = nextValue;
    this.#syncFormValue();
    this.#syncValidity();

    if (changed && shouldRender) this.requestRender();
    return changed;
  }

  #syncLabels() {
    const assignedLabel = this.#assignedSlotText(this.#labelSlot);
    const assignedDescription = this.#assignedSlotText(this.#descriptionSlot);
    const label = assignedLabel || this.label;
    const description = assignedDescription || this.description;
    const hasLabelSlot = this.#labelSlot.assignedNodes().length > 0;
    const hasDescriptionSlot = this.#descriptionSlot.assignedNodes().length > 0;

    this.#heading.hidden = !label && !description;
    this.#labelFallback.textContent = this.label;
    this.#labelFallback.hidden = hasLabelSlot || !this.label;
    this.#descriptionFallback.textContent = this.description;
    this.#descriptionFallback.hidden = hasDescriptionSlot || !this.description;

    const labelElement = this.renderRoot.querySelector(".editor-label");
    const descriptionElement = this.renderRoot.querySelector(".description");
    labelElement.id = this.#labelId;
    descriptionElement.id = this.#descriptionId;

    this.#editor.setAttribute("aria-label", label ? "" : "Rich text editor");
    this.#textarea.setAttribute("aria-label", label ? "" : "Rich text editor");
    if (label) {
      this.#editor.setAttribute("aria-labelledby", this.#labelId);
      this.#textarea.setAttribute("aria-labelledby", this.#labelId);
      this.#editor.removeAttribute("aria-label");
      this.#textarea.removeAttribute("aria-label");
    } else {
      this.#editor.removeAttribute("aria-labelledby");
      this.#textarea.removeAttribute("aria-labelledby");
    }

    if (description) {
      this.#editor.setAttribute("aria-describedby", this.#descriptionId);
      this.#textarea.setAttribute("aria-describedby", this.#descriptionId);
    } else {
      this.#editor.removeAttribute("aria-describedby");
      this.#textarea.removeAttribute("aria-describedby");
    }

    this.#toolbar.setAttribute("aria-label", label ? `${label} formatting` : "Text formatting");
  }

  #ensureEditor() {
    if (
      this.#editor?.parentElement === this &&
      this.#editor.slot === "editor-surface" &&
      this.#editor.hasAttribute("data-rowan-rich-text-editor-surface")
    ) {
      return;
    }

    for (const removeListener of this.#removeEditorListeners) {
      removeListener();
    }
    this.#removeEditorListeners = [];

    const editor = document.createElement("div");
    editor.className = "editor";
    editor.slot = "editor-surface";
    editor.setAttribute("data-rowan-rich-text-editor-surface", "");
    editor.setAttribute("contenteditable", "true");
    editor.setAttribute("role", "textbox");
    editor.setAttribute("aria-multiline", "true");
    this.append(editor);
    this.#editor = editor;

    this.#removeEditorListeners = [
      this.listen(editor, "input", () => this.#commitEditorInput()),
      this.listen(editor, "paste", (event) => this.#handlePlainTextPaste(event)),
      this.listen(editor, "drop", (event) => this.#handlePlainTextDrop(event)),
      this.listen(editor, "click", (event) => {
        if (event.target.closest?.("a")) event.preventDefault();
      }),
      this.listen(editor, "focusin", () => this.#captureSelection()),
      this.listen(editor, "keyup", () => this.#captureSelection()),
      this.listen(editor, "mouseup", () => this.#captureSelection()),
    ];
  }

  #syncEditingSurface() {
    const serialized = serializeDocument(this.#value);
    const modeChanged = this.#renderedMode !== this.mode;
    if (serialized !== this.#renderedValue || modeChanged) {
      renderDocument(this.#editor, this.#value);
      this.#textarea.value = documentToPlainText(this.#value);
      this.#renderedValue = serialized;
      this.#renderedMode = this.mode;
    }

    const invalid = this.invalid || this.#isValueMissing();
    const supportsFormatting = this.#supportsFormatting();
    const richMode = this.mode === "rich";

    this.#editor.hidden = !richMode;
    this.#editor.contentEditable = richMode && !this.disabled ? "true" : "false";
    this.#editor.setAttribute("aria-disabled", this.disabled ? "true" : "false");
    this.#editor.setAttribute("aria-required", this.required ? "true" : "false");
    this.#editor.setAttribute("aria-invalid", invalid ? "true" : "false");
    this.#editor.setAttribute("aria-placeholder", this.placeholder);
    this.#textarea.hidden = richMode;
    this.#textarea.disabled = this.disabled;
    this.#textarea.required = this.required;
    this.#textarea.placeholder = this.placeholder;
    this.#textarea.setAttribute("aria-invalid", invalid ? "true" : "false");
    this.#toolbar.hidden = !richMode;
    this.#editorPlaceholder.textContent = this.placeholder;
    this.#editorPlaceholder.hidden =
      !richMode || !this.placeholder || !isDocumentEmpty(this.#value);

    for (const button of this.#toolbar.querySelectorAll("button")) {
      button.disabled = this.disabled || !supportsFormatting;
    }

    this.#syncToolbarState();
  }

  #syncToolbarState() {
    if (!this.#toolbar) return;

    const canReadState = this.mode === "rich" && this.#hasEditorSelection();
    for (const button of this.#toolbar.querySelectorAll("button[data-command]")) {
      const command = button.dataset.command;
      let active = false;

      if (canReadState && command) {
        try {
          if (command === "heading") {
            const block =
              typeof document.queryCommandValue === "function"
                ? document.queryCommandValue("formatBlock")
                : "";
            active = /^h[1-3]$/i.test(block);
          } else if (command === "link") {
            active =
              typeof document.queryCommandState === "function" &&
              document.queryCommandState("createLink");
          } else if (typeof document.queryCommandState === "function") {
            active = document.queryCommandState(command);
          }
        } catch (_error) {
          active = false;
        }
      }

      button.setAttribute("aria-pressed", active ? "true" : "false");
    }
  }

  #commitEditorInput() {
    if (this.disabled || this.mode !== "rich") return;
    this.#captureSelection();
    this.#commitUserDocument(documentFromEditingSurface(this.#editor));
  }

  #commitPlainTextInput() {
    if (this.disabled || this.mode !== "plain") return;
    this.#commitUserDocument(documentFromPlainText(this.#textarea.value));
  }

  #commitUserDocument(value) {
    const changed = this.#assignValue(value, false);
    if (!changed) return;

    this.#renderedValue = serializeDocument(this.#value);
    this.#renderedMode = this.mode;
    emit(this, "rowan-change", {
      value: this.value,
      text: this.text,
    });
  }

  #handleToolbarClick(event) {
    const actionButton = event
      .composedPath()
      .find((node) => node instanceof HTMLButtonElement && node.dataset.linkAction);
    if (actionButton) {
      if (actionButton.disabled || this.mode !== "rich") return;
      this.#handleLinkAction(actionButton.dataset.linkAction);
      return;
    }

    const button = this.#buttonFromEvent(event);
    if (!button || button.disabled || this.mode !== "rich") return;

    const command = button.dataset.command;
    this.#captureSelection();
    this.#editor.focus({ preventScroll: true });
    this.#restoreSelection();

    if (command === "heading") {
      this.#toggleHeading();
      return;
    }

    if (command === "link") {
      this.#toggleLinkPopover();
      return;
    }

    if (!MARK_COMMANDS.has(command) || typeof document.execCommand !== "function") return;
    document.execCommand(command, false);
    this.#captureSelection();
    this.#commitUserDocument(documentFromEditingSurface(this.#editor));
    this.#syncToolbarState();
  }

  #toggleHeading() {
    if (typeof document.execCommand !== "function") return;

    const block =
      typeof document.queryCommandValue === "function"
        ? document.queryCommandValue("formatBlock")
        : "";
    document.execCommand("formatBlock", false, /^h[1-3]$/i.test(block) ? "div" : "h2");
    this.#captureSelection();
    this.#commitUserDocument(documentFromEditingSurface(this.#editor));
    this.#syncToolbarState();
  }

  #toggleLinkPopover() {
    if (!this.#linkPopover || typeof this.#linkPopover.showPopover !== "function") return;

    if (this.#linkPopover.matches(":popover-open")) {
      this.#linkPopover.hidePopover();
      return;
    }

    this.#linkHrefInput.value = this.#selectionHref();
    this.#linkPopover.showPopover();
    this.#linkHrefInput.focus({ preventScroll: true });
  }

  #syncLinkPopoverState(event) {
    const expanded = event.newState === "open";
    this.#toolbar
      ?.querySelector('button[data-command="link"]')
      ?.setAttribute("aria-expanded", expanded ? "true" : "false");
    if (expanded) this.#linkHrefInput.value = this.#selectionHref();
  }

  #selectionHref() {
    const range = this.#savedRange;
    if (!range) return "";

    const node = range.commonAncestorContainer;
    const element = node instanceof Element ? node : node.parentElement;
    const anchor = element?.closest?.("a");
    if (!anchor || !this.#editor.contains(anchor)) return "";
    return normalizeHref(anchor.getAttribute("href"));
  }

  #handleLinkAction(action) {
    this.#editor.focus({ preventScroll: true });
    this.#restoreSelection();
    if (typeof document.execCommand !== "function") return;

    if (action === "remove") {
      document.execCommand("unlink", false);
    } else if (action === "apply") {
      const href = normalizeHref(this.#linkHrefInput.value);
      if (!href) return;
      document.execCommand("createLink", false, href);
    } else {
      return;
    }

    this.#captureSelection();
    this.#commitUserDocument(documentFromEditingSurface(this.#editor));
    this.#syncToolbarState();
    if (typeof this.#linkPopover.hidePopover === "function") this.#linkPopover.hidePopover();
  }

  #handlePlainTextPaste(event) {
    if (this.disabled || this.mode !== "rich") return;
    event.preventDefault();
    this.#insertPlainText(event.clipboardData?.getData("text/plain") ?? "");
  }

  #handlePlainTextDrop(event) {
    if (this.disabled || this.mode !== "rich") return;
    event.preventDefault();
    this.#insertPlainText(event.dataTransfer?.getData("text/plain") ?? "");
  }

  #insertPlainText(value) {
    const text = String(value ?? "");
    if (!text) return;

    this.#captureSelection();
    this.#editor.focus({ preventScroll: true });
    this.#restoreSelection();

    if (typeof document.execCommand === "function") {
      document.execCommand("insertText", false, text);
    } else {
      const selection = document.getSelection();
      if (selection?.rangeCount) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }

    this.#captureSelection();
    this.#commitUserDocument(documentFromEditingSurface(this.#editor));
  }

  #captureSelection() {
    if (!this.#editor || this.mode !== "rich") return;
    if (this.#linkPopover?.matches(":popover-open")) return;

    const selection = this.#selection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (this.#editor.contains(range.commonAncestorContainer)) {
      this.#savedRange = range.cloneRange();
    }
  }

  #restoreSelection() {
    if (!this.#savedRange || !this.#editor?.isConnected) return;

    const selection = this.#selection();
    if (!selection) return;

    selection.removeAllRanges();
    selection.addRange(this.#savedRange);
  }

  #hasEditorSelection() {
    const selection = this.#selection();
    return Boolean(
      selection?.rangeCount &&
      this.#editor?.contains(selection.getRangeAt(0).commonAncestorContainer),
    );
  }

  #selection() {
    const root = this.#editor?.getRootNode();
    const scopedSelection = typeof root?.getSelection === "function" ? root.getSelection() : null;
    return scopedSelection?.rangeCount ? scopedSelection : document.getSelection();
  }

  #buttonFromEvent(event) {
    return event
      .composedPath()
      .find((node) => node instanceof HTMLButtonElement && node.dataset.command);
  }

  #assignedSlotText(slot) {
    return slot
      .assignedNodes()
      .map((node) => node.textContent ?? "")
      .join(" ")
      .trim();
  }

  #supportsFormatting() {
    return typeof document.execCommand === "function";
  }

  #activeInput() {
    return this.mode === "plain" ? this.#textarea : this.#editor;
  }

  #isValueMissing() {
    return this.required && !this.disabled && isDocumentEmpty(this.#value);
  }

  #syncFormValue() {
    this.setFormValue();
  }

  #syncValidity() {
    if (this.#isValueMissing()) {
      this.setValidity(
        { valueMissing: true },
        validityMessage("valueMissing.content"),
        this.#activeInput(),
      );
      return;
    }

    this.setValidity({}, "", this.#activeInput());
  }

  #applyDefaultA11y() {
    if (!this.internals) return;

    const label = this.#labelSlot
      ? this.#assignedSlotText(this.#labelSlot) || this.label
      : this.label;
    const description = this.#descriptionSlot
      ? this.#assignedSlotText(this.#descriptionSlot) || this.description
      : this.description;

    if (!this.hasAttribute("role") && "role" in this.internals) {
      this.internals.role = "group";
    }

    if (!this.hasAttribute("aria-label") && "ariaLabel" in this.internals) {
      this.internals.ariaLabel = label || "Rich text editor";
    }

    if (!this.hasAttribute("aria-description") && "ariaDescription" in this.internals) {
      this.internals.ariaDescription = description || null;
    }

    if (!this.hasAttribute("aria-required") && "ariaRequired" in this.internals) {
      this.internals.ariaRequired = this.required ? "true" : "false";
    }

    if (!this.hasAttribute("aria-disabled") && "ariaDisabled" in this.internals) {
      this.internals.ariaDisabled = this.disabled ? "true" : "false";
    }

    if (!this.hasAttribute("aria-invalid") && "ariaInvalid" in this.internals) {
      this.internals.ariaInvalid = this.invalid || this.#isValueMissing() ? "true" : "false";
    }
  }
}

define("rowan-rich-text-editor", RowanRichTextEditor);
