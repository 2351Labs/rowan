import "./image.js";
import "../badge/badge.js";
import "../button/button.js";
import "../dialog/dialog.js";
import { SAMPLE_MEDIA } from "../../documentation/sample-media.js";

const SAMPLE_SRC = SAMPLE_MEDIA.northYard;

export default {
  title: "Components/Data Display/Image",
  component: "rowan-image",
  tags: ["autodocs"],
  args: {
    alt: "North yard camera",
    href: "https://example.test/cameras/north-yard",
    fit: "cover",
    caption: "North yard · live still",
    overlay: "Needs review",
  },
  argTypes: {
    alt: { control: "text" },
    href: { control: "text" },
    fit: {
      control: "select",
      options: ["cover", "contain"],
    },
    caption: { control: "text" },
    overlay: { control: "text" },
  },
};

export const Playground = {
  render: ({ alt, href, fit, caption, overlay }) => {
    const el = document.createElement("rowan-image");
    el.src = SAMPLE_SRC;
    el.alt = alt;
    el.href = href;
    el.fit = fit;
    if (caption) {
      const captionEl = document.createElement("span");
      captionEl.slot = "caption";
      captionEl.textContent = caption;
      el.append(captionEl);
    }
    if (overlay) {
      const badge = document.createElement("rowan-badge");
      badge.slot = "overlay";
      badge.tone = "warning";
      badge.textContent = overlay;
      el.append(badge);
    }
    return el;
  },
};

export const Fallback = {
  render: () => {
    const el = document.createElement("rowan-image");
    el.src = "missing-camera.jpg";
    el.alt = "South dock";
    const fallback = document.createElement("span");
    fallback.slot = "fallback";
    fallback.textContent = "Still unavailable";
    el.append(fallback);
    return el;
  },
};

export const Contain = {
  name: "Contain fit",
  render: () => {
    const el = document.createElement("rowan-image");
    el.src = SAMPLE_MEDIA.southDock;
    el.alt = "South dock and the river gate";
    el.fit = "contain";
    el.loading = "eager";
    const caption = document.createElement("span");
    caption.slot = "caption";
    caption.textContent = "South dock · contain";
    el.append(caption);
    return el;
  },
};

export const Lightbox = {
  name: "Lightbox",
  render: () => {
    const root = document.createElement("div");
    const trigger = document.createElement("rowan-button");
    trigger.variant = "secondary";
    trigger.textContent = "Open lightbox";

    const dialog = document.createElement("rowan-dialog");
    const title = document.createElement("span");
    title.slot = "title";
    title.textContent = "North yard";
    const still = document.createElement("rowan-image");
    still.src = SAMPLE_MEDIA.northYard;
    still.alt = "North yard loading docks at dusk";
    still.fit = "contain";
    still.loading = "eager";
    const close = document.createElement("rowan-button");
    close.slot = "actions";
    close.variant = "secondary";
    close.textContent = "Close";
    dialog.append(title, still, close);

    trigger.addEventListener("rowan-click", () => {
      dialog.open = true;
    });
    close.addEventListener("rowan-click", () => {
      dialog.open = false;
    });
    root.append(trigger, dialog);
    return root;
  },
};

export const LoadingModes = {
  name: "Lazy and eager",
  render: () => {
    const row = document.createElement("div");
    row.style.display = "grid";
    row.style.gap = "1rem";
    for (const loading of ["lazy", "eager"]) {
      const el = document.createElement("rowan-image");
      el.src = SAMPLE_SRC;
      el.alt = `North yard camera, ${loading}`;
      el.loading = loading;
      row.append(el);
    }
    return row;
  },
};
