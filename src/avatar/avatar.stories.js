import "./avatar.js";

export default {
  title: "Components/Avatar",
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    src: { control: "text" },
    alt: { control: "text" },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
  args: {
    name: "Ava Pine",
    src: "",
    alt: "",
    size: "md",
  },
};

export const Playground = {
  render: ({ name, src, alt, size }) => {
    const el = document.createElement("rowan-avatar");
    el.name = name;
    el.src = src;
    el.alt = alt;
    if (size !== "md") el.setAttribute("size", size);
    return el;
  },
};
