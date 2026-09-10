import "./empty-state.js";
import "../button/button.js";

export default {
  title: "Components/Empty State",
  tags: ["autodocs"],
};

export const Playground = {
  render: () => {
    const el = document.createElement("rowan-empty-state");

    const icon = document.createElement("span");
    icon.slot = "icon";
    icon.textContent = "◌";

    const title = document.createElement("span");
    title.slot = "title";
    title.textContent = "No saved trails";

    const body = document.createElement("p");
    body.textContent = "Create your first trail plan to get started.";

    const button = document.createElement("rowan-button");
    button.slot = "actions";
    button.textContent = "Create trail";

    el.append(icon, title, body, button);
    return el;
  },
};
