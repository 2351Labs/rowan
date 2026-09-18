import { expect } from "@esm-bundle/chai";
import "./rich-text-editor.js";

const nextMicrotask = () => Promise.resolve();

function surfaceFor(editor) {
  return editor.querySelector("[data-rowan-rich-text-editor-surface]");
}

function selectionFor(surface) {
  const root = surface.getRootNode();
  return typeof root.getSelection === "function" ? root.getSelection() : document.getSelection();
}

async function renderEditor({ value = { blocks: [] }, mode = "rich", required = false } = {}) {
  const editor = document.createElement("rowan-rich-text-editor");
  editor.label = "Operational guidance";
  editor.value = value;
  editor.mode = mode;
  editor.required = required;
  document.body.append(editor);
  await nextMicrotask();
  await nextMicrotask();
  return editor;
}

function selectEditorContents(editor) {
  const surface = surfaceFor(editor);
  surface.focus();
  const range = document.createRange();
  range.selectNodeContents(surface);
  const selection = selectionFor(surface);
  selection.removeAllRanges();
  selection.addRange(range);
  return surface;
}

function selectEditorTextRange(editor, start, end) {
  const surface = surfaceFor(editor);
  surface.focus();
  const text = surface.firstElementChild.firstChild;
  const range = document.createRange();
  range.setStart(text, start);
  range.setEnd(text, end);
  const selection = selectionFor(surface);
  selection.removeAllRanges();
  selection.addRange(range);
  return surface;
}

describe("rowan-rich-text-editor", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("normalizes a property-only document value without mutating caller-owned data", async () => {
    const source = {
      blocks: [
        {
          type: "paragraph",
          children: [
            { text: "Safety ", bold: true },
            { text: "instructions", italic: true, unsupported: true },
          ],
        },
      ],
    };
    const editor = await renderEditor({ value: source });

    source.blocks[0].children[0].text = "Changed outside the editor";
    const value = editor.value;

    expect(editor.hasAttribute("value")).to.equal(false);
    expect(value).to.deep.equal({
      blocks: [
        {
          type: "paragraph",
          children: [
            { text: "Safety ", bold: true },
            { text: "instructions", italic: true },
          ],
        },
      ],
    });
    expect(editor.text).to.equal("Safety instructions");
    const surface = surfaceFor(editor);
    expect(surface.querySelector("strong").textContent).to.equal("Safety ");
    expect(surface.querySelector("em").textContent).to.equal("instructions");
  });

  it("keeps parent assignments silent and emits one normalized user change for toolbar formatting", async () => {
    const editor = await renderEditor({
      value: {
        blocks: [{ type: "paragraph", children: [{ text: "Escalate immediately" }] }],
      },
    });
    const changes = [];
    editor.addEventListener("rowan-change", (event) => changes.push(event));

    editor.value = {
      blocks: [{ type: "paragraph", children: [{ text: "Escalate immediately" }] }],
    };
    await nextMicrotask();
    expect(changes).to.have.length(0);

    const surface = selectEditorTextRange(editor, 9, 20);
    editor.shadowRoot.querySelector('button[data-command="bold"]').click();
    await nextMicrotask();

    expect(editor.value.blocks[0].children).to.deep.equal([
      { text: "Escalate " },
      { text: "immediately", bold: true },
    ]);
    expect(changes).to.have.length(1);
    expect(changes[0].detail).to.deep.equal({
      value: editor.value,
      text: "Escalate immediately",
    });
    expect(changes[0].bubbles).to.equal(true);
    expect(changes[0].composed).to.equal(true);

    surface.focus();
    expect(document.execCommand("undo", false)).to.equal(true);
    await nextMicrotask();

    expect(editor.value.blocks[0].children).to.deep.equal([{ text: "Escalate immediately" }]);
    expect(changes).to.have.length(2);
  });

  it("ignores HTML strings assigned to value and does not emit rowan-change", async () => {
    const editor = await renderEditor({
      value: { blocks: [{ type: "paragraph", children: [{ text: "Keep" }] }] },
    });
    const changes = [];
    editor.addEventListener("rowan-change", (event) => changes.push(event));

    editor.value = "<p><strong>Injected</strong></p>";
    await nextMicrotask();

    expect(editor.value).to.deep.equal({ blocks: [] });
    expect(editor.text).to.equal("");
    expect(surfaceFor(editor).querySelector("strong")).to.equal(null);
    expect(changes).to.have.length(0);
  });

  it("inserts clipboard text literally instead of accepting rich clipboard markup", async () => {
    const editor = await renderEditor({
      value: { blocks: [{ type: "paragraph", children: [{ text: "Replace me" }] }] },
    });
    const surface = selectEditorContents(editor);
    const paste = new Event("paste", { bubbles: true, composed: true, cancelable: true });
    Object.defineProperty(paste, "clipboardData", {
      value: { getData: () => "<strong>Untrusted markup</strong>" },
    });

    surface.dispatchEvent(paste);
    await nextMicrotask();

    expect(paste.defaultPrevented).to.equal(true);
    expect(editor.text).to.equal("<strong>Untrusted markup</strong>");
    expect(editor.value.blocks[0].children).to.deep.equal([
      { text: "<strong>Untrusted markup</strong>" },
    ]);
    expect(surface.querySelector("strong")).to.equal(null);
  });

  it("offers a textarea plain-text fallback that emits a structured document", async () => {
    const editor = await renderEditor({ mode: "plain" });
    const textarea = editor.shadowRoot.querySelector("textarea");
    const changes = [];
    editor.addEventListener("rowan-change", (event) => changes.push(event));

    expect(editor.shadowRoot.querySelector(".toolbar").hidden).to.equal(true);
    textarea.value = "Open the incident\nNotify the on-call lead";
    textarea.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await nextMicrotask();

    expect(editor.value).to.deep.equal({
      blocks: [
        { type: "paragraph", children: [{ text: "Open the incident" }] },
        { type: "paragraph", children: [{ text: "Notify the on-call lead" }] },
      ],
    });
    expect(changes).to.have.length(1);
  });

  it("submits a serialized document through FACE, resets, and preserves author ARIA", async () => {
    const form = document.createElement("form");
    const editor = document.createElement("rowan-rich-text-editor");
    editor.name = "guidance";
    editor.label = "Runbook";
    editor.value = { blocks: [{ type: "paragraph", children: [{ text: "Initial guidance" }] }] };
    editor.setAttribute("aria-label", "Custom runbook label");
    form.append(editor);
    document.body.append(form);
    await nextMicrotask();
    await nextMicrotask();

    expect(new FormData(form).get("guidance")).to.equal(
      JSON.stringify({
        blocks: [{ type: "paragraph", children: [{ text: "Initial guidance" }] }],
      }),
    );

    editor.text = "Replacement guidance";
    form.reset();
    await nextMicrotask();
    expect(editor.text).to.equal("Initial guidance");

    editor.required = true;
    editor.clear();
    await nextMicrotask();
    expect(editor.checkValidity()).to.equal(false);
    expect(editor.internals.role).to.equal("group");
    expect(editor.getAttribute("aria-label")).to.equal("Custom runbook label");
    expect(editor.internals.ariaLabel).to.equal("Runbook");
  });

  it("toggles a heading block from the toolbar", async () => {
    const editor = await renderEditor({
      value: { blocks: [{ type: "paragraph", children: [{ text: "Containment" }] }] },
    });
    const changes = [];
    editor.addEventListener("rowan-change", (event) => changes.push(event));

    selectEditorContents(editor);
    editor.shadowRoot.querySelector('button[data-command="heading"]').click();
    await nextMicrotask();

    expect(editor.value.blocks[0]).to.deep.equal({
      type: "heading",
      level: 2,
      children: [{ text: "Containment" }],
    });
    expect(surfaceFor(editor).querySelector("h2").textContent).to.equal("Containment");
    expect(changes).to.have.length(1);
  });

  it("applies an allowlisted link and drops javascript hrefs", async () => {
    const editor = await renderEditor({
      value: { blocks: [{ type: "paragraph", children: [{ text: "Open the incident" }] }] },
    });
    selectEditorTextRange(editor, 0, 4);
    editor.shadowRoot.querySelector('button[data-command="link"]').click();
    const hrefInput = editor.shadowRoot.querySelector(".link-href");
    hrefInput.value = "https://example.test/incidents/12";
    editor.shadowRoot.querySelector("[data-link-action='apply']").click();
    await nextMicrotask();

    expect(editor.value.blocks[0].children).to.deep.equal([
      { text: "Open", href: "https://example.test/incidents/12" },
      { text: " the incident" },
    ]);
    expect(surfaceFor(editor).querySelector("a").getAttribute("href")).to.equal(
      "https://example.test/incidents/12",
    );

    editor.value = {
      blocks: [
        {
          type: "paragraph",
          children: [{ text: "Open", href: "javascript:alert(1)" }],
        },
      ],
    };
    await nextMicrotask();
    expect(editor.value.blocks[0].children).to.deep.equal([{ text: "Open" }]);
    expect(surfaceFor(editor).querySelector("a")).to.equal(null);
  });

  it("names the link popover and styles headings on the editing surface", async () => {
    const editor = await renderEditor({
      value: { blocks: [{ type: "heading", level: 2, children: [{ text: "Containment" }] }] },
    });

    expect(editor.shadowRoot.querySelector(".link-popover").getAttribute("role")).to.equal(
      "dialog",
    );
    expect(editor.querySelector("style[data-rowan-rich-text-surface]")).to.not.equal(null);
    expect(getComputedStyle(surfaceFor(editor).querySelector("h2")).fontWeight).to.equal("600");
  });
});
