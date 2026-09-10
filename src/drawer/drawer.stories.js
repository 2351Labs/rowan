import "./drawer.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Drawer",
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean" },
    side: { control: { type: "radio" }, options: ["start", "end"] },
    content: { control: "text" },
  },
  args: {
    open: true,
    side: "start",
    content: "Drawer content for settings or navigation.",
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Click backdrop or Close to dismiss."],
    events: ["rowan-change"],
  }),
  render: ({ open, side, content }) => {
    const drawer = document.createElement("rowan-drawer");
    drawer.side = side;
    if (open) drawer.setAttribute("open", "");

    const title = document.createElement("strong");
    title.slot = "title";
    title.textContent = "Navigation";
    drawer.append(title);

    drawer.append(content);
    return drawer;
  },
};
