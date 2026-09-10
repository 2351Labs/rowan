import "./alert.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Alert",
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: "select",
      options: ["info", "success", "warning", "danger"],
    },
    dismissible: { control: "boolean" },
    message: { control: "text" },
  },
  args: {
    tone: "info",
    dismissible: true,
    message: "Trail conditions updated successfully.",
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: [
      "Ensure Dismissible is turned on in Controls.",
      "Click the close affordance on the alert.",
      "Confirm rowan-dismiss appears in Event Trace.",
    ],
    events: ["rowan-dismiss"],
  }),
  render: ({ tone, dismissible, message }) => {
    const alert = document.createElement("rowan-alert");
    if (tone !== "info") alert.setAttribute("tone", tone);
    if (dismissible) alert.setAttribute("dismissible", "");
    alert.textContent = message;
    return alert;
  },
};
