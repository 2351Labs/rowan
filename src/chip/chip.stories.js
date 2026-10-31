import "./chip.js";

export default {
  title: "Components/Actions & Feedback/Chip",
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: "select",
      options: ["info", "success", "warning", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    label: { control: "text" },
  },
  args: {
    tone: "info",
    size: "md",
    label: "Platform",
  },
};

export const Playground = {
  render: ({ tone, size, label }) => {
    const el = document.createElement("rowan-chip");
    if (tone !== "info") el.setAttribute("tone", tone);
    if (size !== "md") el.setAttribute("size", size);
    el.textContent = label;
    return el;
  },
};

export const WithAffixes = {
  name: "Prefix and suffix",
  render: () => {
    const el = document.createElement("rowan-chip");
    el.tone = "success";
    const prefix = document.createElement("span");
    prefix.slot = "prefix";
    prefix.textContent = "EN";
    const suffix = document.createElement("span");
    suffix.slot = "suffix";
    suffix.textContent = "12";
    el.append(prefix, "Platform", suffix);
    return el;
  },
};
