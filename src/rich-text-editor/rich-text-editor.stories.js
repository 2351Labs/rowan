import "./rich-text-editor.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

const RUNBOOK_DOCUMENT = {
  blocks: [
    {
      type: "paragraph",
      children: [
        { text: "Escalation guidance: ", bold: true },
        { text: "notify the incident lead before changing service routing." },
      ],
    },
    {
      type: "unordered-list",
      items: [
        [{ text: "Open the incident record" }],
        [{ text: "Record the current customer impact", italic: true }],
        [{ text: "Page the assigned on-call team" }],
      ],
    },
  ],
};

function createEditor({
  value = RUNBOOK_DOCUMENT,
  mode = "rich",
  required = false,
  disabled = false,
} = {}) {
  const editor = document.createElement("rowan-rich-text-editor");
  editor.label = "Incident response guidance";
  editor.description = "Keep the operational steps concise and actionable.";
  editor.placeholder = "Describe the response steps";
  editor.mode = mode;
  editor.required = required;
  editor.disabled = disabled;
  editor.value = value;
  return editor;
}

export default {
  title: "Components/Rich Text Editor",
  tags: ["autodocs"],
  argTypes: {
    mode: { control: "select", options: ["rich", "plain"] },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    mode: "rich",
    required: false,
    disabled: false,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Select text, use a format control, or type directly in the editing surface."],
    events: ["rowan-change"],
  }),
  render: (args) => createEditor(args),
};

export const OperationalRunbook = {
  parameters: createEventScriptParameters({
    steps: ["Use the ordered and unordered list controls to structure operational guidance."],
    events: ["rowan-change"],
  }),
  render: () => createEditor({ required: true }),
};

export const PlainTextFallback = {
  parameters: createEventScriptParameters({
    steps: ["Use the textarea fallback when a workflow requires text without inline formatting."],
    events: ["rowan-change"],
  }),
  render: () => createEditor({ mode: "plain", value: { blocks: [] } }),
};
