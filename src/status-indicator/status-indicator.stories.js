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
  tags: ["autodocs"],
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
