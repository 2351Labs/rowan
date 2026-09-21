import "../src/index.js";

const INITIAL_HTML = `<div style="display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap">
  <rowan-button>Save</rowan-button>
  <rowan-text-field label="Site"></rowan-text-field>
  <rowan-badge>Operational</rowan-badge>
</div>
`;

function renderMarkup(target, html) {
  const parsed = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
  parsed.querySelectorAll("script, iframe, object, embed").forEach((node) => node.remove());
  target.replaceChildren(...parsed.body.firstElementChild.childNodes);
}

export default {
  title: "Playground",
  parameters: {
    a11y: { disable: true, test: "off" },
    rowanEventTrace: false,
    layout: "fullscreen",
  },
};

export const Sandbox = {
  render: () => {
    const root = document.createElement("div");
    root.style.display = "grid";
    root.style.gridTemplateColumns = "minmax(16rem, 1fr) minmax(16rem, 1fr)";
    root.style.gridTemplateRows = "auto 1fr";
    root.style.gap = "0.75rem";
    root.style.minHeight = "100%";
    root.style.padding = "1rem";
    root.style.boxSizing = "border-box";
    root.style.background = "var(--rowan-color-bg, #ffffff)";
    root.style.color = "var(--rowan-color-fg, #1a221d)";
    root.style.fontFamily = "var(--rowan-font-family, system-ui, sans-serif)";

    const label = document.createElement("label");
    label.textContent = "HTML";
    label.style.fontWeight = "600";
    label.style.fontSize = "0.875rem";

    const previewLabel = document.createElement("div");
    previewLabel.textContent = "Preview";
    previewLabel.style.fontWeight = "600";
    previewLabel.style.fontSize = "0.875rem";

    const editor = document.createElement("textarea");
    editor.setAttribute("aria-label", "Playground HTML");
    editor.value = INITIAL_HTML;
    editor.spellcheck = false;
    editor.style.minHeight = "24rem";
    editor.style.padding = "0.75rem";
    editor.style.border = "1px solid var(--rowan-color-border, #d8dcd5)";
    editor.style.borderRadius = "6px";
    editor.style.font =
      "0.8125rem/1.45 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    editor.style.resize = "vertical";
    editor.style.background = "var(--rowan-color-surface, #ffffff)";
    editor.style.color = "inherit";

    const preview = document.createElement("div");
    preview.style.minHeight = "24rem";
    preview.style.padding = "0.75rem";
    preview.style.border = "1px solid var(--rowan-color-border, #d8dcd5)";
    preview.style.borderRadius = "6px";
    preview.style.overflow = "auto";

    const render = () => renderMarkup(preview, editor.value);
    editor.addEventListener("input", render);
    render();

    root.append(label, previewLabel, editor, preview);
    return root;
  },
};
