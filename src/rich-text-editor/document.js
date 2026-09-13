const BLOCK_TYPES = new Set(["paragraph", "unordered-list", "ordered-list"]);
const UNSAFE_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "TEMPLATE",
  "IFRAME",
  "OBJECT",
  "EMBED",
  "SVG",
  "MATH",
]);

/**
 * @typedef {object} RowanRichTextRun
 * @property {string} text
 * @property {boolean} [bold]
 * @property {boolean} [italic]
 * @property {boolean} [underline]
 */

/**
 * @typedef {object} RowanRichTextParagraph
 * @property {"paragraph"} type
 * @property {RowanRichTextRun[]} children
 */

/**
 * @typedef {object} RowanRichTextList
 * @property {"unordered-list"|"ordered-list"} type
 * @property {RowanRichTextRun[][]} items
 */

/**
 * @typedef {object} RowanRichTextDocument
 * @property {Array<RowanRichTextParagraph | RowanRichTextList>} blocks
 */

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value) {
  return String(value ?? "").replace(/\r\n?/g, "\n");
}

function normalizeMarks(value) {
  return {
    bold: Boolean(value?.bold),
    italic: Boolean(value?.italic),
    underline: Boolean(value?.underline),
  };
}

function hasSameMarks(left, right) {
  return (
    Boolean(left.bold) === Boolean(right.bold) &&
    Boolean(left.italic) === Boolean(right.italic) &&
    Boolean(left.underline) === Boolean(right.underline)
  );
}

/**
 * Converts unknown input into the supported inline-run representation.
 * @param {unknown} value
 * @returns {RowanRichTextRun[]}
 */
export function normalizeRuns(value) {
  const source = Array.isArray(value) ? value : [];
  /** @type {RowanRichTextRun[]} */
  const runs = [];

  for (const item of source) {
    if (!isObject(item)) continue;

    const text = normalizeText(item.text);
    if (!text) continue;

    const marks = normalizeMarks(item);
    const previous = runs.at(-1);
    if (previous && hasSameMarks(previous, marks)) {
      previous.text += text;
      continue;
    }

    runs.push({
      text,
      ...Object.fromEntries(Object.entries(marks).filter(([, marked]) => marked)),
    });
  }

  return runs;
}

/**
 * Normalizes an external document without accepting HTML or executable markup.
 * @param {unknown} value
 * @returns {RowanRichTextDocument}
 */
export function normalizeDocument(value) {
  const source = isObject(value) ? value : {};
  const blocks = Array.isArray(source.blocks) ? source.blocks : [];

  return {
    blocks: blocks.flatMap((block) => {
      if (!isObject(block) || !BLOCK_TYPES.has(block.type)) return [];

      if (block.type === "paragraph") {
        return [{ type: "paragraph", children: normalizeRuns(block.children) }];
      }

      const sourceItems = Array.isArray(block.items) ? block.items : [];
      return [
        {
          type: block.type,
          items: sourceItems.map((item) => normalizeRuns(item)),
        },
      ];
    }),
  };
}

/**
 * @param {unknown} value
 * @returns {RowanRichTextDocument}
 */
export function cloneDocument(value) {
  return normalizeDocument(value);
}

/**
 * @param {unknown} value
 * @returns {RowanRichTextDocument}
 */
export function documentFromPlainText(value) {
  const text = normalizeText(value);
  if (!text) return { blocks: [] };

  return {
    blocks: text.split("\n").map((line) => ({
      type: "paragraph",
      children: line ? [{ text: line }] : [],
    })),
  };
}

/**
 * @param {unknown} value
 * @returns {string}
 */
export function documentToPlainText(value) {
  const documentValue = normalizeDocument(value);
  return documentValue.blocks
    .flatMap((block) => {
      if (block.type === "paragraph") {
        return [block.children.map((run) => run.text).join("")];
      }

      return block.items.map((item) => item.map((run) => run.text).join(""));
    })
    .join("\n");
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isDocumentEmpty(value) {
  return documentToPlainText(value).trim().length === 0;
}

/**
 * @param {unknown} value
 * @returns {string}
 */
export function serializeDocument(value) {
  return JSON.stringify(normalizeDocument(value));
}

/**
 * @param {unknown} value
 * @returns {RowanRichTextDocument}
 */
export function parseStoredDocument(value) {
  if (typeof value !== "string") return { blocks: [] };

  try {
    return normalizeDocument(JSON.parse(value));
  } catch (_error) {
    return documentFromPlainText(value);
  }
}

function appendRuns(parent, runs) {
  for (const run of runs) {
    /** @type {Node} */
    let node = document.createTextNode(run.text);

    if (run.underline) {
      const wrapper = document.createElement("u");
      wrapper.append(node);
      node = wrapper;
    }

    if (run.italic) {
      const wrapper = document.createElement("em");
      wrapper.append(node);
      node = wrapper;
    }

    if (run.bold) {
      const wrapper = document.createElement("strong");
      wrapper.append(node);
      node = wrapper;
    }

    parent.append(node);
  }
}

function appendPlaceholderBreak(parent, runs) {
  if (runs.length === 0) parent.append(document.createElement("br"));
}

/**
 * Renders only normalized document nodes into an editing surface.
 * @param {HTMLElement} root
 * @param {unknown} value
 */
export function renderDocument(root, value) {
  const documentValue = normalizeDocument(value);
  const fragment = document.createDocumentFragment();

  for (const block of documentValue.blocks) {
    if (block.type === "paragraph") {
      const paragraph = document.createElement("div");
      appendRuns(paragraph, block.children);
      appendPlaceholderBreak(paragraph, block.children);
      fragment.append(paragraph);
      continue;
    }

    const list = document.createElement(block.type === "ordered-list" ? "ol" : "ul");
    for (const itemRuns of block.items) {
      const item = document.createElement("li");
      appendRuns(item, itemRuns);
      appendPlaceholderBreak(item, itemRuns);
      list.append(item);
    }

    if (block.items.length === 0) {
      const item = document.createElement("li");
      item.append(document.createElement("br"));
      list.append(item);
    }

    fragment.append(list);
  }

  root.replaceChildren(fragment);
}

function marksFromElement(element, inheritedMarks) {
  const tagName = element.tagName;
  const style = element.getAttribute("style")?.toLowerCase() ?? "";

  return {
    bold:
      inheritedMarks.bold ||
      tagName === "B" ||
      tagName === "STRONG" ||
      /font-weight\s*:\s*(bold|[6-9]\d\d)/.test(style),
    italic:
      inheritedMarks.italic ||
      tagName === "I" ||
      tagName === "EM" ||
      /font-style\s*:\s*italic/.test(style),
    underline:
      inheritedMarks.underline ||
      tagName === "U" ||
      /text-decoration(?:-line)?\s*:[^;]*underline/.test(style),
  };
}

function collectRuns(node, marks = {}) {
  if (node.nodeType === Node.TEXT_NODE) {
    return normalizeRuns([{ text: node.textContent ?? "", ...marks }]);
  }

  if (!(node instanceof HTMLElement) || UNSAFE_TAGS.has(node.tagName)) return [];
  if (node.tagName === "BR") return normalizeRuns([{ text: "\n", ...marks }]);

  const nextMarks = marksFromElement(node, marks);
  return [...node.childNodes].flatMap((child) => collectRuns(child, nextMarks));
}

function runsForElement(element) {
  const visibleChildren = [...element.childNodes].filter(
    (child) => !(child instanceof HTMLElement && child.tagName === "BR"),
  );
  if (visibleChildren.length === 0) return [];

  return normalizeRuns([...element.childNodes].flatMap((child) => collectRuns(child)));
}

/**
 * Extracts the allowed structure from a user-edited contenteditable surface.
 * Unknown elements are reduced to text and their attributes are never preserved.
 * @param {HTMLElement} root
 * @returns {RowanRichTextDocument}
 */
export function documentFromEditingSurface(root) {
  /** @type {Array<RowanRichTextParagraph | RowanRichTextList>} */
  const blocks = [];
  /** @type {RowanRichTextRun[]} */
  let looseRuns = [];

  const appendLooseRuns = () => {
    if (looseRuns.length === 0) return;
    blocks.push({ type: "paragraph", children: normalizeRuns(looseRuns) });
    looseRuns = [];
  };

  for (const child of root.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      looseRuns.push(...collectRuns(child));
      continue;
    }

    if (!(child instanceof HTMLElement) || UNSAFE_TAGS.has(child.tagName)) continue;

    if (child.tagName === "UL" || child.tagName === "OL") {
      appendLooseRuns();
      const items = [...child.children]
        .filter((item) => item.tagName === "LI")
        .map((item) => runsForElement(item));
      blocks.push({
        type: child.tagName === "OL" ? "ordered-list" : "unordered-list",
        items,
      });
      continue;
    }

    if (child.tagName === "BR") {
      looseRuns.push({ text: "\n" });
      continue;
    }

    appendLooseRuns();
    blocks.push({ type: "paragraph", children: runsForElement(child) });
  }

  appendLooseRuns();
  return normalizeDocument({ blocks });
}
