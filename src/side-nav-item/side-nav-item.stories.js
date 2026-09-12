import "./side-nav-item.js";

function createItem({ active = true, disabled = false, external = false } = {}) {
  const item = document.createElement("rowan-side-nav-item");
  item.active = active;
  item.disabled = disabled;
  item.external = external;
  item.href = "#overview";
  item.label = "Overview";
  item.style.maxInlineSize = "17rem";
  return item;
}

export default {
  title: "Components/Side Navigation Item",
  tags: ["autodocs"],
  args: { active: true, disabled: false, external: false },
  argTypes: {
    active: { control: "boolean" },
    disabled: { control: "boolean" },
    external: { control: "boolean" },
  },
};

export const Playground = {
  render: (args) => createItem(args),
};
