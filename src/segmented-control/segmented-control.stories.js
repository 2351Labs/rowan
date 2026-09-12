import "./segmented-control.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

const OPTIONS = [
  { value: "board", label: "Board" },
  { value: "list", label: "List" },
  { value: "timeline", label: "Timeline" },
];

export default {
  title: "Components/Segmented control",
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
  args: {
    value: "board",
    size: "md",
    disabled: false,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Choose a view mode or use the Arrow keys to move between modes."],
    events: ["rowan-change"],
  }),
  render: ({ value, size, disabled }) => {
    const control = document.createElement("rowan-segmented-control");
    control.label = "View mode";
    control.options = OPTIONS;
    control.value = value;
    control.size = size;
    control.disabled = disabled;
    return control;
  },
};

export const CompactModes = {
  parameters: createEventScriptParameters({
    steps: ["Switch between compact workspace modes."],
    events: ["rowan-change"],
  }),
  render: () => {
    const control = document.createElement("rowan-segmented-control");
    control.label = "Density";
    control.size = "sm";
    control.options = [
      { value: "comfortable", label: "Comfortable" },
      { value: "compact", label: "Compact" },
    ];
    control.value = "comfortable";
    return control;
  },
};
