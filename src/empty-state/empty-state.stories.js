import "./empty-state.js";
import "../button/button.js";

export default {
  title: "Components/Actions & Feedback/Empty State",
  component: "rowan-empty-state",
  tags: ["autodocs"],
  args: {
    title: "No saved trails",
    body: "Create your first trail plan to get started.",
    actionLabel: "Create trail",
  },
  argTypes: {
    title: { control: "text" },
    body: { control: "text" },
    actionLabel: { control: "text" },
  },
};

export const Playground = {
  render: ({ title, body, actionLabel }) => {
    const el = document.createElement("rowan-empty-state");

    const icon = document.createElement("span");
    icon.slot = "icon";
    icon.textContent = "◌";

    const titleEl = document.createElement("span");
    titleEl.slot = "title";
    titleEl.textContent = title;

    const bodyEl = document.createElement("p");
    bodyEl.textContent = body;

    const button = document.createElement("rowan-button");
    button.slot = "actions";
    button.textContent = actionLabel;

    el.append(icon, titleEl, bodyEl, button);
    return el;
  },
};
