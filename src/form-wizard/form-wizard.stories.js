import "./form-wizard.js";
import "../checkbox/checkbox.js";
import "../text-field/text-field.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

function createTextField({ label, name, value = "", required = false }) {
  const field = document.createElement("rowan-text-field");
  field.label = label;
  field.name = name;
  field.value = value;
  field.required = required;
  return field;
}

function createPanel(slot, label, ...content) {
  const panel = document.createElement("section");
  panel.slot = slot;
  panel.dataset.stepLabel = label;
  panel.className = "wizard-story-panel";
  panel.append(...content);
  return panel;
}

function createDescription(text) {
  const description = document.createElement("p");
  description.textContent = text;
  return description;
}

function createWizard({
  currentStep = 1,
  orientation = "horizontal",
  disabled = false,
  complete = false,
}) {
  const wizard = document.createElement("rowan-form-wizard");
  wizard.steps = [
    { id: "details", label: "Details" },
    { id: "preferences", label: "Preferences" },
    { id: "review", label: "Review" },
  ];
  wizard.currentStep = currentStep;
  wizard.orientation = orientation;
  wizard.disabled = disabled;

  const details = createPanel(
    "step-details",
    "Details",
    createDescription("Capture the core account details before continuing."),
    createTextField({
      label: "Organization name",
      name: "organization",
      value: complete ? "Cedar & Co." : "",
      required: true,
    }),
  );

  const email = createTextField({
    label: "Billing email",
    name: "email",
    value: complete ? "finance@cedar.example" : "",
    required: true,
  });
  email.type = "email";

  details.append(email);

  const receiveUpdates = document.createElement("rowan-checkbox");
  receiveUpdates.name = "updates";
  receiveUpdates.checked = complete;
  receiveUpdates.textContent = "Send launch updates";

  const preferences = createPanel(
    "step-preferences",
    "Preferences",
    createDescription("Choose how this workspace should communicate with your team."),
    receiveUpdates,
  );

  const review = createPanel(
    "step-review",
    "Review",
    createDescription("Review your selections, then complete the setup workflow."),
  );

  wizard.append(details, preferences, review);
  return wizard;
}

export default {
  title: "Workflows/Form Wizard",
  component: "rowan-form-wizard",
  tags: ["autodocs"],
  argTypes: {
    currentStep: { control: { type: "number", min: 1, max: 3 } },
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    disabled: { control: "boolean" },
  },
  args: {
    currentStep: 1,
    orientation: "horizontal",
    disabled: false,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: [
      "Try Continue with empty required fields to inspect validation recovery.",
      "Complete the Details panel and progress through the workflow.",
      "Activate Complete on the final panel.",
    ],
    events: ["rowan-step-change", "rowan-invalid", "rowan-complete"],
  }),
  render: (args) => createWizard(args),
};

export const ReadyToComplete = {
  render: () => createWizard({ complete: true }),
};

export const Vertical = {
  render: () => createWizard({ orientation: "vertical", complete: true }),
};
