import "./confirm-dialog.js";
import "../button/button.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

function createConfirmDialog({ open = false, confirmVariant = "danger" } = {}) {
  const wrapper = document.createElement("div");
  const trigger = document.createElement("rowan-button");
  trigger.textContent = "Archive project";

  const dialog = document.createElement("rowan-confirm-dialog");
  dialog.open = open;
  dialog.label = "Archive project";
  dialog.confirmLabel = "Archive";
  dialog.confirmVariant = confirmVariant;

  const title = document.createElement("span");
  title.slot = "title";
  title.textContent = "Archive this project?";

  const content = document.createElement("p");
  content.textContent = "Archived projects remain available to workspace administrators.";
  dialog.append(title, content);

  trigger.addEventListener("rowan-click", () => dialog.show());
  wrapper.append(trigger, dialog);
  return wrapper;
}

export default {
  title: "Components/Confirm Dialog",
  tags: ["autodocs"],
  args: { open: false, confirmVariant: "danger" },
  argTypes: {
    open: { control: "boolean" },
    confirmVariant: { control: "select", options: ["primary", "danger"] },
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Open the dialog, then confirm, cancel, or press Escape."],
    events: ["rowan-confirm", "rowan-cancel", "rowan-close"],
  }),
  render: (args) => createConfirmDialog(args),
};
