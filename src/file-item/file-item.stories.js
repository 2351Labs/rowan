import "./file-item.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/File Item",
  tags: ["autodocs"],
  argTypes: {
    filename: { control: "text" },
    filesize: { control: "number" },
    status: {
      control: "select",
      options: ["queued", "uploading", "success", "failed"],
    },
    progress: { control: "number" },
    disabled: { control: "boolean" },
  },
  args: {
    filename: "report-q3.csv",
    filesize: 183200,
    status: "queued",
    progress: 0,
    disabled: false,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Trigger file actions based on current status."],
    events: ["rowan-remove", "rowan-retry", "rowan-cancel"],
  }),
  render: ({ filename, filesize, status, progress, disabled }) => {
    const item = document.createElement("rowan-file-item");
    item.filename = filename;
    item.filesize = filesize;
    item.status = status;
    item.progress = progress;
    item.disabled = disabled;
    return item;
  },
};

export const States = {
  render: () => {
    const wrapper = document.createElement("div");
    wrapper.style.display = "grid";
    wrapper.style.gap = "0.75rem";

    const queued = document.createElement("rowan-file-item");
    queued.filename = "queued.csv";
    queued.filesize = 24000;
    queued.status = "queued";

    const uploading = document.createElement("rowan-file-item");
    uploading.filename = "uploading.csv";
    uploading.filesize = 99000;
    uploading.status = "uploading";
    uploading.progress = 62;

    const success = document.createElement("rowan-file-item");
    success.filename = "success.csv";
    success.filesize = 31200;
    success.status = "success";

    const failed = document.createElement("rowan-file-item");
    failed.filename = "failed.csv";
    failed.filesize = 1800;
    failed.status = "failed";

    wrapper.append(queued, uploading, success, failed);
    return wrapper;
  },
};