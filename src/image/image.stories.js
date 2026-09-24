import "./image.js";
import "../badge/badge.js";

const SAMPLE_SRC =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
      <rect width="640" height="360" fill="#1d432f"/>
      <circle cx="420" cy="120" r="48" fill="#f8f7f2" fill-opacity="0.18"/>
      <rect x="48" y="220" width="220" height="16" rx="8" fill="#f8f7f2" fill-opacity="0.55"/>
    </svg>`,
  );

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
