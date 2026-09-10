import "./pagination.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

export default {
  title: "Components/Pagination",
  tags: ["autodocs"],
  argTypes: {
    page: { control: { type: "number", min: 1 } },
    totalPages: { control: { type: "number", min: 1 } },
  },
  args: {
    page: 2,
    totalPages: 5,
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: ["Click Previous or Next to change page."],
    events: ["rowan-page-change"],
  }),
  render: ({ page, totalPages }) => {
    const pagination = document.createElement("rowan-pagination");
    pagination.page = page;
    pagination.totalPages = totalPages;
    return pagination;
  },
};
