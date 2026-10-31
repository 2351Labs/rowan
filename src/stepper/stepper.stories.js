import "./stepper.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

const meta = {
  title: "Workflows/Stepper",
  component: "rowan-stepper",
  tags: ["autodocs"],
  argTypes: {
    currentStep: { control: { type: "number", min: 1 } },
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    disabled: { control: "boolean" },
  },
};

export default meta;

const Template = ({ currentStep = 2, orientation = "horizontal", disabled = false }) => {
  const stepper = document.createElement("rowan-stepper");
  stepper.steps = ["Draft", "Review", "Publish", "Confirm"];
  stepper.currentStep = currentStep;
  stepper.orientation = orientation;
  stepper.disabled = disabled;
  return stepper;
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Activate another step. rowan-step-change reports the selected step."],
    events: ["rowan-step-change"],
  }),
  render: Template,
  args: {
    currentStep: 2,
    orientation: "horizontal",
    disabled: false,
  },
};

export const Vertical = {
  render: Template,
  args: {
    currentStep: 3,
    orientation: "vertical",
    disabled: false,
  },
};
