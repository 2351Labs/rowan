import "./skeleton.js";

export default {
  title: "Components/Skeleton",
  tags: ["autodocs"],
  argTypes: {
    shape: {
      control: "select",
      options: ["text", "rect", "circle"],
    },
    width: { control: "text" },
    height: { control: "text" },
    animated: { control: "boolean" },
  },
  args: {
    shape: "text",
    width: "100%",
    height: "",
    animated: true,
  },
};

export const Playground = {
  render: ({ shape, width, height, animated }) => {
    const el = document.createElement("rowan-skeleton");
    if (shape !== "text") el.setAttribute("shape", shape);
    if (width) el.setAttribute("width", width);
    if (height) el.setAttribute("height", height);
    if (animated) el.setAttribute("animated", "");
    return el;
  },
};
