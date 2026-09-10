import { setCustomElementsManifest } from "@storybook/web-components";
import customElements from "../custom-elements.json";
import "../src/tokens/tokens.css";
import "../src/tokens/themes/light.css";
import "../src/tokens/themes/dark.css";

setCustomElementsManifest(customElements);

function isLikelyHtmlSource(source) {
  if (typeof source !== "string") {
    return false;
  }

  const trimmed = source.trim();
  return trimmed.startsWith("<") && trimmed.endsWith(">") && /<[a-z]/i.test(trimmed);
}

function escapeAttributeValue(value) {
  return String(value).replace(/&/g, "&amp;").replace(/\"/g, "&quot;");
}

function formatHtmlNode(node, depth = 0) {
  const indent = "  ".repeat(depth);

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim();
    return text ? `${indent}${text}` : "";
  }

  if (!(node instanceof Element)) {
    return "";
  }

  const tagName = node.tagName.toLowerCase();
  const attributes = Array.from(node.attributes)
    .map((attribute) => ` ${attribute.name}="${escapeAttributeValue(attribute.value)}"`)
    .join("");

  const children = Array.from(node.childNodes)
    .map((child) => formatHtmlNode(child, depth + 1))
    .filter((line) => line.length > 0);

  if (children.length === 0) {
    return `${indent}<${tagName}${attributes}></${tagName}>`;
  }

  const isTextOnly = children.length === 1 && !children[0].trimStart().startsWith("<");
  if (isTextOnly) {
    return `${indent}<${tagName}${attributes}>${children[0].trim()}</${tagName}>`;
  }

  return `${indent}<${tagName}${attributes}>\n${children.join("\n")}\n${indent}</${tagName}>`;
}

function formatStorySource(source) {
  if (!isLikelyHtmlSource(source)) {
    return source;
  }

  try {
    const template = document.createElement("template");
    template.innerHTML = source.trim();

    const lines = Array.from(template.content.childNodes)
      .map((node) => formatHtmlNode(node, 0))
      .filter((line) => line.length > 0);

    return lines.length > 0 ? lines.join("\n") : source;
  } catch (_error) {
    return source;
  }
}

const ROWAN_EVENT_HANDLES = [
  "rowan-click",
  "rowan-change",
  "rowan-close",
  "rowan-dismiss",
  "rowan-sort",
  "rowan-select",
  "rowan-cell-change",
  "rowan-cell-action",
  "rowan-page-change",
  "rowan-row-activate",
];

function describeEventTarget(target) {
  if (!(target instanceof Element)) {
    return "unknown";
  }

  const id = target.id ? `#${target.id}` : "";
  return `<${target.tagName.toLowerCase()}${id}>`;
}

function formatEventDetail(detail) {
  if (detail === undefined) {
    return "{}";
  }

  try {
    return JSON.stringify(
      detail,
      (_key, value) => {
        if (value instanceof Element) {
          return describeEventTarget(value);
        }

        if (typeof value === "function") {
          return value.toString();
        }

        return value;
      },
      2,
    );
  } catch (_error) {
    return String(detail);
  }
}

function normalizeTraceList(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry) => typeof entry === "string" && entry.trim().length > 0)
    .map((entry) => entry.trim());
}

function createEventTraceStory(storyNode, context) {
  if (!(storyNode instanceof Node)) {
    return storyNode;
  }

  if (context.viewMode !== "story") {
    return storyNode;
  }

  const traceOptions = context.parameters?.rowanEventTrace;
  if (traceOptions === false || traceOptions?.enabled === false) {
    return storyNode;
  }

  const maxEntries =
    Number.isInteger(traceOptions?.maxEntries) && traceOptions.maxEntries > 0
      ? traceOptions.maxEntries
      : 12;
  const scriptSteps = normalizeTraceList(traceOptions?.script);
  const expectedEvents = normalizeTraceList(traceOptions?.events);

  const wrapper = document.createElement("section");
  wrapper.style.display = "grid";
  wrapper.style.gap = "1rem";
  wrapper.style.alignItems = "start";
  wrapper.style.gridTemplateColumns = window.matchMedia("(max-width: 1120px)").matches
    ? "1fr"
    : "minmax(0, 1.75fr) minmax(18rem, 1fr)";

  const stage = document.createElement("div");
  stage.style.minWidth = "0";
  stage.append(storyNode);

  const panel = document.createElement("aside");
  panel.style.border = "1px solid var(--rowan-color-border, #ced3ca)";
  panel.style.borderRadius = "8px";
  panel.style.background = "var(--rowan-color-bg, #ffffff)";
  panel.style.overflow = "hidden";

  const head = document.createElement("div");
  head.style.display = "flex";
  head.style.alignItems = "center";
  head.style.justifyContent = "space-between";
  head.style.gap = "0.5rem";
  head.style.padding = "0.6rem 0.75rem";
  head.style.borderBottom = "1px solid var(--rowan-color-border, #ced3ca)";

  const titleWrap = document.createElement("div");

  const title = document.createElement("p");
  title.textContent = "Event Trace";
  title.style.margin = "0";
  title.style.fontSize = "0.85rem";
  title.style.fontWeight = "700";
  title.style.fontFamily = "var(--rowan-font-family, system-ui, sans-serif)";

  const subtitle = document.createElement("p");
  subtitle.textContent = "Listening for Rowan custom events.";
  subtitle.style.margin = "0.125rem 0 0 0";
  subtitle.style.color = "var(--rowan-color-muted, #5f6d62)";
  subtitle.style.fontSize = "0.75rem";
  subtitle.style.fontFamily = "var(--rowan-font-family, system-ui, sans-serif)";

  titleWrap.append(title, subtitle);

  const clearButton = document.createElement("button");
  clearButton.type = "button";
  clearButton.textContent = "Clear";
  clearButton.style.border = "1px solid var(--rowan-color-border, #ced3ca)";
  clearButton.style.borderRadius = "6px";
  clearButton.style.padding = "0.25rem 0.45rem";
  clearButton.style.background = "transparent";
  clearButton.style.cursor = "pointer";
  clearButton.style.fontSize = "0.75rem";

  head.append(titleWrap, clearButton);

  const body = document.createElement("div");
  body.style.padding = "0.5rem";

  if (scriptSteps.length > 0 || expectedEvents.length > 0) {
    const guide = document.createElement("div");
    guide.style.margin = "0 0 0.5rem 0";
    guide.style.padding = "0.5rem";
    guide.style.border = "1px solid var(--rowan-color-border, #ced3ca)";
    guide.style.borderRadius = "6px";
    guide.style.background = "#f6f8f5";

    if (scriptSteps.length > 0) {
      const guideTitle = document.createElement("p");
      guideTitle.textContent = "Try this:";
      guideTitle.style.margin = "0";
      guideTitle.style.fontSize = "0.76rem";
      guideTitle.style.fontWeight = "700";
      guideTitle.style.fontFamily = "var(--rowan-font-family, system-ui, sans-serif)";

      const stepList = document.createElement("ol");
      stepList.style.margin = "0.35rem 0 0 1.15rem";
      stepList.style.padding = "0";
      stepList.style.display = "grid";
      stepList.style.gap = "0.2rem";
      stepList.style.fontSize = "0.74rem";
      stepList.style.lineHeight = "1.35";
      stepList.style.fontFamily = "var(--rowan-font-family, system-ui, sans-serif)";

      for (const step of scriptSteps) {
        const item = document.createElement("li");
        item.textContent = step;
        stepList.append(item);
      }

      guide.append(guideTitle, stepList);
    }

    if (expectedEvents.length > 0) {
      const expected = document.createElement("p");
      expected.textContent = `Expected events: ${expectedEvents.join(", ")}`;
      expected.style.margin = scriptSteps.length > 0 ? "0.45rem 0 0 0" : "0";
      expected.style.fontSize = "0.74rem";
      expected.style.color = "var(--rowan-color-muted, #5f6d62)";
      expected.style.fontFamily =
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      guide.append(expected);
    }

    body.append(guide);
  }

  const emptyState = document.createElement("p");
  emptyState.textContent = "Interact with the component to capture events.";
  emptyState.style.margin = "0";
  emptyState.style.padding = "0.5rem";
  emptyState.style.color = "var(--rowan-color-muted, #5f6d62)";
  emptyState.style.fontSize = "0.78rem";
  emptyState.style.fontFamily = "var(--rowan-font-family, system-ui, sans-serif)";

  const list = document.createElement("ol");
  list.style.margin = "0";
  list.style.padding = "0";
  list.style.listStyle = "none";
  list.style.display = "grid";
  list.style.gap = "0.5rem";
  list.style.maxHeight = "19rem";
  list.style.overflow = "auto";

  function syncEmptyState() {
    emptyState.style.display = list.childElementCount > 0 ? "none" : "block";
  }

  function appendEntry(event) {
    const item = document.createElement("li");
    item.style.border = "1px solid var(--rowan-color-border, #ced3ca)";
    item.style.borderRadius = "6px";
    item.style.background = "#f6f8f5";

    const meta = document.createElement("p");
    const time = new Date().toLocaleTimeString();
    meta.textContent = `${event.type} - ${time}`;
    meta.style.margin = "0";
    meta.style.padding = "0.45rem 0.55rem 0.2rem";
    meta.style.fontWeight = "700";
    meta.style.fontSize = "0.74rem";
    meta.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

    const target = document.createElement("p");
    target.textContent = `target: ${describeEventTarget(event.target)}`;
    target.style.margin = "0";
    target.style.padding = "0 0.55rem 0.35rem";
    target.style.fontSize = "0.72rem";
    target.style.color = "var(--rowan-color-muted, #5f6d62)";
    target.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

    const detail = document.createElement("pre");
    detail.textContent = formatEventDetail(event.detail);
    detail.style.margin = "0";
    detail.style.padding = "0.45rem 0.55rem 0.55rem";
    detail.style.borderTop = "1px solid var(--rowan-color-border, #ced3ca)";
    detail.style.fontSize = "0.72rem";
    detail.style.lineHeight = "1.4";
    detail.style.whiteSpace = "pre-wrap";
    detail.style.wordBreak = "break-word";
    detail.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

    item.append(meta, target, detail);
    list.prepend(item);

    while (list.childElementCount > maxEntries) {
      list.lastElementChild?.remove();
    }

    syncEmptyState();
  }

  clearButton.addEventListener("click", () => {
    list.replaceChildren();
    syncEmptyState();
  });

  for (const type of ROWAN_EVENT_HANDLES) {
    wrapper.addEventListener(type, appendEntry);
  }

  body.append(emptyState, list);
  panel.append(head, body);
  wrapper.append(stage, panel);

  syncEmptyState();
  return wrapper;
}

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Global theme",
    defaultValue: "light",
    toolbar: {
      icon: "paintbrush",
      items: ["light", "dark"],
      dynamicTitle: true,
    },
  },
  direction: {
    name: "Direction",
    description: "Text direction",
    defaultValue: "ltr",
    toolbar: {
      icon: "transfer",
      items: ["ltr", "rtl"],
    },
  },
  density: {
    name: "Density",
    description: "Layout density",
    defaultValue: "md",
    toolbar: {
      icon: "align",
      items: ["sm", "md", "lg"],
    },
  },
};

export const decorators = [
  (story, context) => {
    const root = document.documentElement;
    root.dataset.theme = context.globals.theme;
    root.setAttribute("dir", context.globals.direction);
    root.dataset.density = context.globals.density;
    const storyNode = story();
    return createEventTraceStory(storyNode, context);
  },
];

export const parameters = {
  a11y: {
    test: "error",
  },
  actions: {
    handles: ROWAN_EVENT_HANDLES,
  },
  docs: {
    source: {
      type: "dynamic",
      language: "html",
      transform: (source) => formatStorySource(source),
    },
  },
};
