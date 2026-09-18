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
    static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
    };
    attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
    set name(value: string);
    get name(): string;
    set label(value: string);
    get label(): string;
    set description(value: string);
    get description(): string;
    set placeholder(value: string);
    get placeholder(): string;
    set mode(value: "plain" | "rich");
    get mode(): "plain" | "rich";
    set disabled(value: boolean);
    get disabled(): boolean;
    set required(value: boolean);
    get required(): boolean;
    set invalid(value: boolean);
    get invalid(): boolean;
    /** @param {import("./document.js").RowanRichTextDocument} value */
    set value(value: import("./document.js").RowanRichTextDocument);
    /** @returns {import("./document.js").RowanRichTextDocument} */
    get value(): import("./document.js").RowanRichTextDocument;
    set text(value: string);
    get text(): string;
    clear(): void;
    focus(options: any): void;
    setFormValue(value?: string | null, state?: string): void;
    setValidity(flags?: {}, message?: string, anchor?: null): void;
    formResetCallback(): void;
    formStateRestoreCallback(state: any): void;
    checkValidity(): boolean;
    reportValidity(): boolean;
    #private;
}
import { BaseElement } from "../lib/base-element.js";
