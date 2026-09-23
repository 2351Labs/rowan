import "./side-nav-item.js";

function createItem({
  label = "Overview",
  active = true,
  disabled = false,
  external = false,
  tone = "none",
  count = null,
  countLabel = "",
} = {}) {
  const item = document.createElement("rowan-side-nav-item");
  item.active = active;
  item.disabled = disabled;
  item.external = external;
  item.href = "#overview";
  item.label = label;
  item.tone = tone;
  item.count = count;
  if (countLabel) item.countLabel = countLabel;
  item.style.maxInlineSize = "17rem";
  return item;
}

export default {
  title: "Components/Navigation & Layout/Side Navigation Item",
  tags: ["autodocs"],
  args: { active: true, disabled: false, external: false, tone: "none", count: 0 },
  argTypes: {
    active: { control: "boolean" },
    disabled: { control: "boolean" },
    external: { control: "boolean" },
    tone: {
      control: "select",
      options: ["none", "info", "success", "warning", "danger"],
    },
    count: { control: "number" },
  },
};

export const Playground = {
  render: (args) =>
    createItem({
      ...args,
      count: args.count > 0 ? args.count : null,
    }),
};

export const Status = {
  render: () => {
    const list = document.createElement("div");
    list.style.display = "grid";
    list.style.gap = "0.35rem";
    list.style.maxInlineSize = "17rem";
    list.append(
      createItem({ label: "Overview", tone: "none", active: true }),
      createItem({ label: "Capacity", tone: "warning", active: false }),
      createItem({ label: "Incidents", tone: "danger", count: 3, active: false }),
      createItem({ label: "Inbox", count: 12, countLabel: "unread", active: false }),
    );
    const custom = createItem({ label: "Live ops", active: false });
    const suffix = document.createElement("span");
    suffix.slot = "suffix";
    suffix.textContent = "Beta";
    custom.append(suffix);
    list.append(custom);
    return list;
  },
};
