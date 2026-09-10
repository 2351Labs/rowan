import "./spinner.js";

export default {
  title: "Components/Spinner",
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    label: { control: "text" },
  },
  args: {
    size: "md",
    label: "Loading",
  },
};

export const Playground = {
  render: ({ size, label }) => {
    const el = document.createElement("rowan-spinner");
    if (size !== "md") el.setAttribute("size", size);
    if (label) el.setAttribute("label", label);
    return el;
  },
};
