import "./toaster.js";
import "../button/button.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Toaster",
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: "select",
      options: ["top-start", "top-end", "bottom-start", "bottom-end", "bottom-center"],
    },
    maxVisible: { control: "number" },
    duration: { control: "number" },
  },
  args: {
    placement: "top-end",
    maxVisible: 2,
    duration: 3000,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: [
      "Click each trigger button to enqueue notifications.",
      "Dismiss one manually or wait for timeout.",
      "Confirm rowan-toast-show and rowan-toast-dismiss appear in Event Trace.",
    ],
    events: ["rowan-toast-show", "rowan-toast-dismiss"],
  }),
  render: ({ placement, maxVisible, duration }) => {
    const shell = document.createElement("div");
    shell.style.display = "grid";
    shell.style.gap = "0.75rem";

    const controls = document.createElement("div");
    controls.style.display = "flex";
    controls.style.flexWrap = "wrap";
    controls.style.gap = "0.5rem";

    const toaster = document.createElement("rowan-toaster");
    toaster.placement = placement;
    toaster.maxVisible = maxVisible;
    toaster.duration = duration;

    const successButton = document.createElement("rowan-button");
    successButton.textContent = "Show success";
    successButton.setAttribute("size", "sm");
    successButton.addEventListener("rowan-click", () => {
      toaster.show({
        tone: "success",
        title: "Sync complete",
        message: "42 invoices were synced.",
      });
    });

    const warningButton = document.createElement("rowan-button");
    warningButton.textContent = "Show warning";
    warningButton.setAttribute("size", "sm");
    warningButton.setAttribute("variant", "secondary");
    warningButton.addEventListener("rowan-click", () => {
      toaster.show({
        tone: "warning",
        title: "Partial import",
        message: "3 records need manual review.",
      });
    });

    const dangerButton = document.createElement("rowan-button");
    dangerButton.textContent = "Show danger";
    dangerButton.setAttribute("size", "sm");
    dangerButton.setAttribute("variant", "danger");
    dangerButton.addEventListener("rowan-click", () => {
      toaster.show({
        tone: "danger",
        title: "Export failed",
        message: "Connection to reporting service was interrupted.",
        duration: 0,
      });
    });

    controls.append(successButton, warningButton, dangerButton);
    shell.append(controls, toaster);

    return shell;
  },
};