import "./card.js";
import "../button/button.js";

export default {
  title: "Components/Data Display/Card",
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

export const MediaHeader = {
  name: "Media and header",
  render: () => {
    const card = document.createElement("rowan-card");
    const media = document.createElement("img");
    media.slot = "media";
    media.alt = "Cedar grove overlook";
    media.src =
      "data:image/svg+xml," +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 200"><rect width="640" height="200" fill="#1d432f"/></svg>',
      );
    const header = document.createElement("p");
    header.slot = "header";
    header.textContent = "Trail note";
    const title = document.createElement("h3");
    title.slot = "title";
    title.textContent = "Evergreen Trail";
    card.append(media, header, title);
    return card;
  },
};
