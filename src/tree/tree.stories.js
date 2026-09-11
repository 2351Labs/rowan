import "./tree.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

function createItem({ value, label, expanded = false, children = [] }) {
  const item = document.createElement("rowan-tree-item");
  item.value = value;
  item.expanded = expanded;
  item.textContent = label;

  for (const child of children) {
    child.slot = "children";
    item.append(child);
  }

  return item;
}

export default {
  title: "Components/Tree",
  tags: ["autodocs"],
  argTypes: {
    selection: { control: "select", options: ["none", "single", "multiple"] },
  },
  args: {
    selection: "single",
  },
};

export const Documentation = {
  parameters: createEventScriptParameters({
    steps: ["Select a tree item or expand a branch."],
    events: ["rowan-change", "rowan-toggle"],
  }),
  render: ({ selection }) => {
    const tree = document.createElement("rowan-tree");
    tree.label = "Documentation";
    tree.selection = selection;
    tree.append(
      createItem({
        value: "guides",
        label: "Guides",
        expanded: true,
        children: [
          createItem({ value: "getting-started", label: "Getting started" }),
          createItem({ value: "theming", label: "Theming" }),
        ],
      }),
      createItem({ value: "components", label: "Components" }),
      createItem({ value: "tokens", label: "Tokens" }),
    );
    return tree;
  },
};
