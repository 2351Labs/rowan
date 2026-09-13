import "./rating.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

function createRating({
  value = 3,
  min = 1,
  max = 5,
  step = 1,
  disabled = false,
  required = false,
} = {}) {
  const rating = document.createElement("rowan-rating");
  rating.label = "Service quality";
  rating.description = "Choose a whole-star rating.";
  rating.min = min;
  rating.max = max;
  rating.step = step;
  rating.value = value;
  rating.disabled = disabled;
  rating.required = required;
  return rating;
}

export default {
  title: "Components/Rating",
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "number", min: 1, max: 5, step: 1 } },
    min: { control: { type: "number", step: 1 } },
    max: { control: { type: "number", step: 1 } },
    step: { control: { type: "number", min: 1, step: 1 } },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
  args: {
    value: 3,
    min: 1,
    max: 5,
    step: 1,
    disabled: false,
    required: false,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Choose a rating with a star or use Arrow, Home, and End keys."],
    events: ["rowan-change"],
  }),
  render: (args) => createRating(args),
};

export const RequiredRating = {
  parameters: createEventScriptParameters({
    steps: ["Clear the selected rating, then choose a new value."],
    events: ["rowan-change"],
  }),
  render: () => {
    const rating = createRating({ required: true, value: 4 });
    rating.name = "service-quality";
    return rating;
  },
};

export const TenPointScale = {
  render: () => {
    const rating = createRating({ min: 0, max: 10, step: 2, value: 6 });
    rating.label = "Recommendation score";
    return rating;
  },
};
