import "./status-indicator.js";

function createIndicator(tone, label, options = {}) {
  const indicator = document.createElement("rowan-status-indicator");
  indicator.tone = tone;
  indicator.label = label;
  indicator.size = options.size ?? "md";
  indicator.pulse = Boolean(options.pulse);
  return indicator;
}

export default {
  title: "Components/Actions & Feedback/Status Indicator",
  component: "rowan-status-indicator",
  tags: ["autodocs"],
  args: {
    tone: "info",
    size: "md",
    label: "Syncing",
    pulse: true,
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["neutral", "info", "success", "warning", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    label: { control: "text" },
    pulse: { control: "boolean" },
  },
};

export const Playground = {
  render: ({ tone, size, label, pulse }) => createIndicator(tone, label, { size, pulse }),
};

export const Tones = {
  render: () => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.flexWrap = "wrap";
    row.style.gap = "var(--rowan-space-4)";

    row.append(
      createIndicator("neutral", "Offline"),
      createIndicator("info", "Syncing", { pulse: true }),
      createIndicator("success", "Operational"),
      createIndicator("warning", "Needs attention"),
      createIndicator("danger", "Unavailable"),
    );
    return row;
  },
};
