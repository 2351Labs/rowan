import "./virtual-list.js";

function createItems(count) {
  return Array.from({ length: count }, (_value, index) => ({
    id: `member-${index + 1}`,
    name: `Member ${index + 1}`,
    detail: index % 3 === 0 ? "Operations" : index % 3 === 1 ? "Design" : "Engineering",
  }));
}

function createVirtualList({ count = 500, itemSize = 44, overscan = 4 } = {}) {
  const list = document.createElement("rowan-virtual-list");
  list.items = createItems(Math.max(1, Math.trunc(Number(count) || 1)));
  list.itemKey = "id";
  list.itemSize = Math.max(1, Number(itemSize) || 44);
  list.overscan = Math.max(0, Math.trunc(Number(overscan) || 0));
  list.renderItem = (item) => {
    const row = document.createElement("div");
    row.style.alignItems = "center";
    row.style.borderBottom = "1px solid var(--rowan-color-border)";
    row.style.boxSizing = "border-box";
    row.style.display = "flex";
    row.style.gap = "var(--rowan-space-3)";
    row.style.minHeight = "44px";
    row.style.padding = "var(--rowan-space-2) var(--rowan-space-3)";

    const name = document.createElement("strong");
    name.textContent = item.name;

    const detail = document.createElement("span");
    detail.textContent = item.detail;
    detail.style.color = "var(--rowan-color-muted)";
    detail.style.fontSize = "var(--rowan-font-size-sm)";

    row.append(name, detail);
    return row;
  };
  return list;
}

export default {
  title: "Components/Virtual List",
  tags: ["autodocs"],
  args: {
    count: 500,
    itemSize: 44,
    overscan: 4,
  },
  argTypes: {
    count: { control: { type: "number", min: 1, step: 1 } },
    itemSize: { control: { type: "number", min: 1, step: 1 } },
    overscan: { control: { type: "number", min: 0, step: 1 } },
  },
};

export const Playground = {
  render: (args) => createVirtualList(args),
};

export const VariableRows = {
  render: () => {
    const list = createVirtualList({ count: 180, itemSize: 44, overscan: 5 });
    list.renderItem = (item, index) => {
      const row = document.createElement("div");
      row.style.borderBottom = "1px solid var(--rowan-color-border)";
      row.style.boxSizing = "border-box";
      row.style.display = "grid";
      row.style.gap = "0.2rem";
      row.style.minHeight = `${index % 5 === 0 ? 72 : 44}px`;
      row.style.padding = "var(--rowan-space-2) var(--rowan-space-3)";

      const name = document.createElement("strong");
      name.textContent = item.name;
      row.append(name);

      if (index % 5 === 0) {
        const detail = document.createElement("span");
        detail.textContent = "This measured row intentionally has more content than the estimate.";
        detail.style.color = "var(--rowan-color-muted)";
        detail.style.fontSize = "var(--rowan-font-size-sm)";
        row.append(detail);
      }

      return row;
    };
    return list;
  },
};
