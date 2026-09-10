import "./progress.js";

export default {
  title: "Components/Progress",
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "number", min: 0, step: 1 } },
    max: { control: { type: "number", min: 1, step: 1 } },
    label: { control: "text" },
  },
  args: {
    value: 42,
    max: 100,
    label: "Quota",
  },
};

export const Playground = {
  render: ({ value, max, label }) => {
    const el = document.createElement("rowan-progress");
    el.value = Number(value);
    el.max = Number(max);
    el.label = label;
    return el;
  },
};
