import "./toast.js";
import "../button/button.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Toast",
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: "select",
      options: ["info", "success", "warning", "danger"],
    },
    dismissible: { control: "boolean" },
    title: { control: "text" },
    message: { control: "text" },
    withAction: { control: "boolean" },
  },
  args: {
    tone: "info",
    dismissible: true,
    title: "Build complete",
    message: "Sprint 1 artifacts are ready for review.",
    withAction: true,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: [
      "Click the Dismiss button.",
      "Confirm rowan-dismiss appears in Event Trace.",
    ],
    events: ["rowan-dismiss"],
  }),
  render: ({ tone, dismissible, title, message, withAction }) => {
    const toast = document.createElement("rowan-toast");

    if (tone !== "info") toast.setAttribute("tone", tone);
    if (dismissible) toast.setAttribute("dismissible", "");

    if (title) {
      const titleNode = document.createElement("span");
      titleNode.slot = "title";
      titleNode.textContent = title;
      toast.append(titleNode);
    }

    const messageNode = document.createElement("span");
    messageNode.textContent = message;
    toast.append(messageNode);

    if (withAction) {
      const action = document.createElement("rowan-button");
      action.slot = "actions";
      action.setAttribute("variant", "secondary");
      action.setAttribute("size", "sm");
      action.textContent = "View details";
      toast.append(action);
    }

    return toast;
  },
};