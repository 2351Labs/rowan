import "./slider.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

function createSlider({
  value = 45,
  min = 0,
  max = 100,
  step = 5,
  range = false,
  disabled = false,
} = {}) {
  const slider = document.createElement("rowan-slider");
  slider.label = range ? "Price range" : "Capacity";
  slider.min = min;
  slider.max = max;
  slider.step = step;
  slider.range = range;
  slider.disabled = disabled;
  slider.value = range ? { start: 25, end: 75 } : value;
  return slider;
}

export default {
  title: "Components/Slider",
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "number", min: 0, max: 100 } },
    min: { control: { type: "number" } },
    max: { control: { type: "number" } },
    step: { control: { type: "number", min: 1 } },
    range: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    value: 45,
    min: 0,
    max: 100,
    step: 5,
    range: false,
    disabled: false,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: [
      "Drag a thumb or use arrow keys to adjust its value.",
      "Turn on Range to expose independent start and end handles.",
      "Inspect user-originated rowan-change payloads in Event Trace.",
    ],
    events: ["rowan-change"],
  }),
  render: (args) => createSlider(args),
};

export const Range = {
  render: () => {
    const slider = createSlider({ min: 0, max: 500, step: 25, range: true });
    slider.name = "budget";
    slider.formatValue = (value) => `$${value.start} - $${value.end}`;
    return slider;
  },
};

export const Formatter = {
  render: () => {
    const slider = createSlider({ value: 72, step: 1 });
    slider.formatValue = (value) => `${value}% capacity`;
    return slider;
  },
};
