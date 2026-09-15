import "./color-picker.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

const BRAND_PALETTE = [
  { value: "#1d432f", label: "Forest" },
  { value: "#24543c", label: "Canopy" },
  { value: "#b4392d", label: "Signal" },
  { value: "#424945", label: "Slate" },
];

export default {
  title: "Components/Forms & Input/Color Picker",
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    value: "#1d432f",
    label: "Project color",
    description: "Choose an approved color or enter a custom one.",
    required: false,
    disabled: false,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Choose an approved swatch or adjust the custom color and opacity."],
    events: ["rowan-change"],
  }),
  render: ({ value, label, description, required, disabled }) => {
    const picker = document.createElement("rowan-color-picker");
    picker.value = value;
    picker.label = label;
    picker.description = description;
    picker.required = required;
    picker.disabled = disabled;
    return picker;
  },
};

export const ApprovedBrandPalette = {
  parameters: createEventScriptParameters({
    steps: ["Use Arrow keys to move through the approved project colors."],
    events: ["rowan-change"],
  }),
  render: () => {
    const picker = document.createElement("rowan-color-picker");
    picker.label = "Brand color";
    picker.description = "Custom colors support transparency when a brand color needs it.";
    picker.palette = BRAND_PALETTE;
    picker.value = "#24543c";
    return picker;
  },
};

export const TranslucentCustomColor = {
  parameters: createEventScriptParameters({
    steps: ["Adjust opacity to produce a normalized eight-digit hexadecimal value."],
    events: ["rowan-change"],
  }),
  render: () => {
    const picker = document.createElement("rowan-color-picker");
    picker.label = "Overlay color";
    picker.value = "#24543c80";
    return picker;
  },
};
