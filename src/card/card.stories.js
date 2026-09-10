import "./card.js";
import "../button/button.js";

export default {
  title: "Components/Card",
  tags: ["autodocs"],
};

export const Composition = {
  render: () => {
    const card = document.createElement("rowan-card");

    const title = document.createElement("h3");
    title.slot = "title";
    title.textContent = "Evergreen Trail";

    const body = document.createElement("p");
    body.textContent = "A quiet route through old-growth cedar groves with two scenic overlooks.";

    const footer = document.createElement("small");
    footer.slot = "footer";
    footer.textContent = "Updated 2h ago";

    const action = document.createElement("rowan-button");
    action.slot = "actions";
    action.textContent = "View details";

    card.append(title, body, footer, action);
    return card;
  },
};
