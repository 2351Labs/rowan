import "./tree-item.js";

export default {
  title: "Components/Tree Item",
  tags: ["autodocs"],
};

export const Branch = {
  render: () => {
    const item = document.createElement("rowan-tree-item");
    const child = document.createElement("rowan-tree-item");

    item.value = "guides";
    item.expanded = true;
    item.textContent = "Guides";
    child.slot = "children";
    child.value = "getting-started";
    child.textContent = "Getting started";
    item.append(child);

    return item;
  },
};
