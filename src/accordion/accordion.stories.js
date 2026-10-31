import "./accordion.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Navigation & Layout/Accordion",
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean" },
    summary: { control: "text" },
    content: { control: "text" },
  },
  args: {
    open: false,
    summary: "Release Notes",
    content: "Minor accessibility and performance updates.",
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Click the header to toggle the section."],
    events: ["rowan-change"],
  }),
  render: ({ open, summary, content }) => {
    const accordion = document.createElement("rowan-accordion");
    accordion.summary = summary;
    if (open) accordion.setAttribute("open", "");
    accordion.textContent = content;
    return accordion;
  },
};

export const SlottedSummary = {
  name: "Slotted summary",
  render: () => {
    const accordion = document.createElement("rowan-accordion");
    accordion.open = true;
    const summary = document.createElement("span");
    summary.slot = "summary";
    summary.textContent = "October release";
    const body = document.createElement("p");
    body.textContent = "Keyboard focus, contrast, and table editing shipped this month.";
    accordion.append(summary, body);
    return accordion;
  },
};
