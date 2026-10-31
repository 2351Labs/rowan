import "./tree-item.js";

export default {
  title: "Components/Navigation & Layout/Tree Item",
  tags: ["autodocs"],
};

export const Branch = {
  render: () => {
    const item = document.createElement("rowan-tree-item");
    const child = document.createElement("rowan-tree-item");

    item.value = "guides";
    item.expanded = true;
    item.selected = true;
    item.disabled = false;
    item.level = 1;
    item.setAttribute("tabindex", "0");
    const prefix = document.createElement("span");
    prefix.slot = "prefix";
    prefix.textContent = "▸";
    item.textContent = "Guides";
    item.append(prefix);
    child.slot = "children";
    child.value = "getting-started";
    child.textContent = "Getting started";
    item.append(child);

    return item;
  },
};
