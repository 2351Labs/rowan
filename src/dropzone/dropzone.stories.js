import "./dropzone.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Dropzone",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    accept: { control: "text" },
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    label: "Drop files to upload",
    description: "or click to select files from your device",
    accept: ".csv,.xlsx",
    multiple: true,
    disabled: false,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Click the dropzone or drag files onto it."],
    events: ["rowan-files-add"],
  }),
  render: ({ label, description, accept, multiple, disabled }) => {
    const dropzone = document.createElement("rowan-dropzone");
    dropzone.label = label;
    dropzone.description = description;
    dropzone.accept = accept;
    dropzone.multiple = multiple;
    dropzone.disabled = disabled;
    return dropzone;
  },
};

export const InCard = {
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.maxWidth = "36rem";

    const dropzone = document.createElement("rowan-dropzone");
    dropzone.label = "Upload purchase records";
    dropzone.description = "CSV and XLSX only";
    dropzone.accept = ".csv,.xlsx";
    dropzone.multiple = true;

    wrapper.append(dropzone);
    return wrapper;
  },
};