import "./link.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Link",
  tags: ["autodocs"],
  argTypes: {
    href: { control: "text" },
    target: { control: "text" },
    external: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    href: "#",
    target: "",
    external: false,
    disabled: false,
    label: "Read trail details",
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Click the link.", "Toggle Disabled and click again."],
    events: ["rowan-click"],
  }),
  render: ({ href, target, external, disabled, label }) => {
    const el = document.createElement("rowan-link");
    el.href = href;
    el.target = target;
    if (external) el.setAttribute("external", "");
    if (disabled) el.setAttribute("disabled", "");
    el.textContent = label;
    return el;
  },
};
