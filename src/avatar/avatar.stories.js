import "./avatar.js";
import { SAMPLE_MEDIA } from "../../documentation/sample-media.js";

export default {
  title: "Components/Data Display/Avatar",
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
    el.locale = "en-US";
    return el;
  },
};

export const Photo = {
  name: "Photo",
  render: () => {
    const el = document.createElement("rowan-avatar");
    el.name = "Ava Pine";
    el.alt = "Ava Pine";
    el.src = SAMPLE_MEDIA.yardWorker;
    el.size = "lg";
    el.locale = "en-US";
    return el;
  },
};
