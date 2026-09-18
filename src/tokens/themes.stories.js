import "../button/button.js";
import "../card/card.js";
import "../chip/chip.js";
import "../text-field/text-field.js";

const THEMES = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "lagoon", label: "Lagoon" },
  { id: "ember", label: "Ember" },
];

function createThemeSample(theme) {
  const wrap = document.createElement("div");
  wrap.dataset.theme = theme.id;
  wrap.style.background = "var(--rowan-color-bg)";
  wrap.style.border = "1px solid var(--rowan-color-border)";
  wrap.style.borderRadius = "var(--rowan-radius-lg)";
  wrap.style.color = "var(--rowan-color-fg)";
  wrap.style.display = "grid";
  wrap.style.gap = "var(--rowan-space-3)";
  wrap.style.padding = "var(--rowan-space-4)";

  const title = document.createElement("strong");
  title.textContent = theme.label;

  const field = document.createElement("rowan-text-field");
  field.label = "Site";
  field.value = "North yard";

  const chip = document.createElement("rowan-chip");
  chip.textContent = "Operational";

  const button = document.createElement("rowan-button");
  button.textContent = "Save";

  wrap.append(title, field, chip, button);
  return wrap;
}

export default {
  title: "Foundations/Themes",
};

export const Gallery = {
  render: () => {
    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gap = "var(--rowan-space-4)";
    grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(14rem, 1fr))";
    for (const theme of THEMES) {
      grid.append(createThemeSample(theme));
    }
    return grid;
  },
};
