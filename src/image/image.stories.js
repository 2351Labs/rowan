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
  tags: ["autodocs"],
};

export const Playground = {
  render: () => {
    const el = document.createElement("rowan-image");
    el.src = SAMPLE_SRC;
    el.alt = "North yard camera";
    el.href = "https://example.test/cameras/north-yard";
    const caption = document.createElement("span");
    caption.slot = "caption";
    caption.textContent = "North yard · live still";
    const badge = document.createElement("rowan-badge");
    badge.slot = "overlay";
    badge.tone = "warning";
    badge.textContent = "Needs review";
    el.append(badge, caption);
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
