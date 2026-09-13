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
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};
export type RowanRichTextParagraph = {
  type: "paragraph";
  children: RowanRichTextRun[];
};
export type RowanRichTextList = {
  type: "unordered-list" | "ordered-list";
  items: RowanRichTextRun[][];
};
export type RowanRichTextDocument = {
  blocks: Array<RowanRichTextParagraph | RowanRichTextList>;
};
