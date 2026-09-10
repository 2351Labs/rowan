import "./dialog.js";
import "../button/button.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Dialog",
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean" },
  },
  args: {
    open: false,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: [
      "Click Open dialog.",
      "Close using the Save action or press Escape.",
      "Compare rowan-click and rowan-close entries in Event Trace.",
    ],
    events: ["rowan-click", "rowan-close"],
  }),
  render: ({ open }) => {
    const wrapper = document.createElement("div");

    const trigger = document.createElement("rowan-button");
    trigger.textContent = "Open dialog";

    const dialog = document.createElement("rowan-dialog");
    if (open) dialog.setAttribute("open", "");

    const title = document.createElement("span");
    title.slot = "title";
    title.textContent = "Confirm route";

    const body = document.createElement("p");
    body.textContent = "Do you want to save this trail plan to your collection?";

    const action = document.createElement("rowan-button");
    action.slot = "actions";
    action.textContent = "Save";

    dialog.append(title, body, action);

    trigger.addEventListener("rowan-click", () => {
      dialog.open = true;
    });

    action.addEventListener("rowan-click", () => {
      dialog.open = false;
    });

    wrapper.append(trigger, dialog);
    return wrapper;
  },
};
