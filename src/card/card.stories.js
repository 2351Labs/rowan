import "./card.js";
import "../button/button.js";
import { SAMPLE_MEDIA } from "../../documentation/sample-media.js";

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
    media.alt = "North yard loading docks at dusk";
    media.src = SAMPLE_MEDIA.northYard;
    media.style.display = "block";
    media.style.width = "100%";
    media.style.height = "9rem";
    media.style.objectFit = "cover";
    media.style.borderRadius = "0.5rem";
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
