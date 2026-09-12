import "./split-pane.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

function createPanel(title, detail) {
  const panel = document.createElement("section");
  panel.style.color = "var(--rowan-color-fg)";
  panel.style.display = "grid";
  panel.style.gap = "var(--rowan-space-2)";
  panel.style.minBlockSize = "100%";
  panel.style.padding = "var(--rowan-space-4)";

  const heading = document.createElement("strong");
  heading.textContent = title;
  const copy = document.createElement("span");
  copy.style.color = "var(--rowan-color-muted)";
  copy.style.fontSize = "var(--rowan-font-size-sm)";
  copy.textContent = detail;
  panel.append(heading, copy);
  return panel;
}

function createSplitPane({ orientation = "horizontal", position = 34, disabled = false } = {}) {
  const pane = document.createElement("rowan-split-pane");
  pane.orientation = orientation;
  pane.position = position;
  pane.min = 20;
  pane.max = 80;
  pane.snapPoints = [25, 50, 75];
  pane.disabled = disabled;
  pane.style.blockSize = "20rem";
  pane.style.border = "1px solid var(--rowan-color-border)";
  pane.style.borderRadius = "var(--rowan-radius-md)";
  pane.style.overflow = "hidden";

  const start = createPanel("Navigation", "Resize with the separator or its keyboard controls.");
  const end = createPanel("Workspace", "Pane contents retain their own scrolling and behavior.");
  start.slot = "start";
  end.slot = "end";
  pane.append(start, end);
  return pane;
}

export default {
  title: "Components/Split Pane",
  tags: ["autodocs"],
  args: {
    orientation: "horizontal",
    position: 34,
    disabled: false,
  },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    position: { control: { type: "range", min: 20, max: 80, step: 1 } },
    disabled: { control: "boolean" },
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Drag the separator or use Arrow keys to resize the panes."],
    events: ["rowan-resize"],
  }),
  render: (args) => createSplitPane(args),
};

export const Vertical = {
  render: () => createSplitPane({ orientation: "vertical", position: 42 }),
};
