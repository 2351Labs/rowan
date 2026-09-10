import "./file-upload.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/File Upload",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    accept: { control: "text" },
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
    maxFiles: { control: "number" },
  },
  args: {
    label: "Upload attachments",
    accept: ".csv,.xlsx,.pdf",
    multiple: true,
    disabled: false,
    maxFiles: 5,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Add files with picker or drag-drop, then remove or retry items."],
    events: ["rowan-files-add", "rowan-file-remove", "rowan-file-retry", "rowan-file-cancel"],
  }),
  render: ({ label, accept, multiple, disabled, maxFiles }) => {
    const upload = document.createElement("rowan-file-upload");
    upload.label = label;
    upload.accept = accept;
    upload.multiple = multiple;
    upload.disabled = disabled;
    upload.maxFiles = maxFiles;
    return upload;
  },
};

export const WithSeededQueue = {
  render: () => {
    const upload = document.createElement("rowan-file-upload");
    upload.label = "Quarterly statements";
    upload.accept = ".csv,.pdf";
    upload.multiple = true;
    upload.maxFiles = 6;
    upload.files = [
      {
        id: "seed-1",
        name: "q1.csv",
        size: 20480,
        status: "success",
      },
      {
        id: "seed-2",
        name: "q2.csv",
        size: 19312,
        status: "uploading",
        progress: 46,
      },
      {
        id: "seed-3",
        name: "q3.csv",
        size: 25121,
        status: "failed",
      },
    ];
    return upload;
  },
};