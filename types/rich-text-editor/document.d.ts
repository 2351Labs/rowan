/**
 * Allows http(s), mailto, in-app paths, and fragments. Drops javascript, data,
 * and other schemes.
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeHref(value: unknown): string;
/**
 * Converts unknown input into the supported inline-run representation.
 * @param {unknown} value
 * @returns {RowanRichTextRun[]}
 */
export function normalizeRuns(value: unknown): RowanRichTextRun[];
/**
 * Normalizes an external document without accepting HTML or executable markup.
 * @param {unknown} value
 * @returns {RowanRichTextDocument}
 */
export function normalizeDocument(value: unknown): RowanRichTextDocument;
/**
 * @param {unknown} value
 * @returns {RowanRichTextDocument}
 */
export function cloneDocument(value: unknown): RowanRichTextDocument;
/**
 * @param {unknown} value
 * @returns {RowanRichTextDocument}
 */
export function documentFromPlainText(value: unknown): RowanRichTextDocument;
/**
 * @param {unknown} value
 * @returns {string}
 */
export function documentToPlainText(value: unknown): string;
/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isDocumentEmpty(value: unknown): boolean;
/**
 * @param {unknown} value
 * @returns {string}
 */
export function serializeDocument(value: unknown): string;
/**
 * @param {unknown} value
 * @returns {RowanRichTextDocument}
 */
export function parseStoredDocument(value: unknown): RowanRichTextDocument;
/**
 * Renders only normalized document nodes into an editing surface.
 * @param {HTMLElement} root
 * @param {unknown} value
 */
export function renderDocument(root: HTMLElement, value: unknown): void;
/**
 * Extracts the allowed structure from a user-edited contenteditable surface.
 * Unknown elements are reduced to text and their attributes are never preserved.
 * @param {HTMLElement} root
 * @returns {RowanRichTextDocument}
 */
export function documentFromEditingSurface(root: HTMLElement): RowanRichTextDocument;
export type RowanRichTextRun = {
    text: string;
    bold?: boolean | undefined;
    italic?: boolean | undefined;
    underline?: boolean | undefined;
    href?: string | undefined;
};
export type RowanRichTextParagraph = {
    type: "paragraph";
    children: RowanRichTextRun[];
};
export type RowanRichTextHeading = {
    type: "heading";
    level: 1 | 2 | 3;
    children: RowanRichTextRun[];
};
export type RowanRichTextList = {
    type: "unordered-list" | "ordered-list";
    items: RowanRichTextRun[][];
};
/**
 * Public document. Blocks are paragraph, heading (levels 1–3), unordered-list,
 * and ordered-list. Runs support bold, italic, underline, and an optional
 * allowlisted href. HTML is never an API value. Images are not document nodes.
 */
export type RowanRichTextDocument = {
    blocks: Array<RowanRichTextParagraph | RowanRichTextHeading | RowanRichTextList>;
};
