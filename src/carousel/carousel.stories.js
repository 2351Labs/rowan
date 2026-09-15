import "./carousel.js";
import "../badge/badge.js";
import { createEventScriptParameters } from "../storybook/event-script.js";

const RELEASE_PANELS = [
  {
    eyebrow: "Release readiness",
    title: "Deploy with a clear rollback path",
    description:
      "The operations checklist is complete, with the previous build retained for a controlled rollback.",
    tone: "success",
    status: "Ready to deploy",
  },
  {
    eyebrow: "Service coverage",
    title: "Two handoffs still need review",
    description:
      "Confirm the weekend support schedule before the release window opens for the regional team.",
    tone: "warning",
    status: "Attention needed",
  },
  {
    eyebrow: "Customer communication",
    title: "Status update is scheduled",
    description:
      "The customer notice will publish with the maintenance start time and a plain-language impact summary.",
    tone: "info",
    status: "Scheduled",
  },
];

function createPanel({ eyebrow, title, description, tone, status }) {
  const panel = document.createElement("article");
  panel.style.background = "var(--rowan-color-bg, #f8f7f2)";
  panel.style.display = "grid";
  panel.style.gap = "0.7rem";
  panel.style.minBlockSize = "13rem";
  panel.style.padding = "1.25rem";

  const heading = document.createElement("div");
  heading.style.display = "grid";
  heading.style.gap = "0.25rem";

  const eyebrowEl = document.createElement("span");
  eyebrowEl.textContent = eyebrow;
  eyebrowEl.style.color = "var(--rowan-color-muted, #5f6d62)";
  eyebrowEl.style.fontSize = "0.75rem";
  eyebrowEl.style.fontWeight = "700";
  eyebrowEl.style.letterSpacing = "0.06em";
  eyebrowEl.style.textTransform = "uppercase";

  const titleEl = document.createElement("h3");
  titleEl.textContent = title;
  titleEl.style.fontSize = "1.15rem";
  titleEl.style.margin = "0";

  heading.append(eyebrowEl, titleEl);

  const body = document.createElement("p");
  body.textContent = description;
  body.style.lineHeight = "1.55";
  body.style.margin = "0";
  body.style.maxInlineSize = "42rem";

  const badge = document.createElement("rowan-badge");
  badge.tone = tone;
  badge.textContent = status;
  badge.style.justifySelf = "start";

  panel.append(heading, body, badge);
  return panel;
}

function createCarousel({ activeIndex = 0, label = "Release readiness highlights" } = {}) {
  const carousel = document.createElement("rowan-carousel");
  carousel.activeIndex = activeIndex;
  carousel.label = label;

  for (const panel of RELEASE_PANELS) {
    carousel.append(createPanel(panel));
  }

  return carousel;
}

export default {
  title: "Components/Navigation & Layout/Carousel",
  component: "rowan-carousel",
  tags: ["autodocs"],
  argTypes: {
    activeIndex: { control: { type: "number", min: 0, max: 2, step: 1 } },
    label: { control: "text" },
  },
  args: {
    activeIndex: 0,
    label: "Release readiness highlights",
  },
};

export const Playground = {
  parameters: createEventScriptParameters({
    steps: [
      "Use the previous or next control, or focus the panel area and use Arrow, Home, or End.",
    ],
    events: ["rowan-change"],
  }),
  render: (args) => createCarousel(args),
};

export const OperationalBriefing = {
  parameters: createEventScriptParameters({
    steps: ["Advance through the three briefing panels without automatic progression."],
    events: ["rowan-change"],
  }),
  render: () => createCarousel({ activeIndex: 1, label: "Operations briefing" }),
};

export const SinglePanel = {
  render: () => {
    const carousel = document.createElement("rowan-carousel");
    carousel.label = "Single deployment note";
    carousel.append(
      createPanel({
        eyebrow: "Deployment note",
        title: "No additional release steps",
        description:
          "The navigation controls remain present but disabled for a one-panel sequence.",
        tone: "info",
        status: "One panel",
      }),
    );
    return carousel;
  },
};
