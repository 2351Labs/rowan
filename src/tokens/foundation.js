// Generated from src/tokens/tokens.css by scripts/sync-token-sheet.mjs. Do not edit directly.
export const tokenPropertyDefinitions = [
  {
    name: "--rowan-color-forest-900",
    syntax: "*",
    inherits: true,
    initialValue: "#10261c",
  },
  {
    name: "--rowan-color-forest-800",
    syntax: "*",
    inherits: true,
    initialValue: "#153224",
  },
  {
    name: "--rowan-color-forest-700",
    syntax: "*",
    inherits: true,
    initialValue: "#1d432f",
  },
  {
    name: "--rowan-color-forest-600",
    syntax: "*",
    inherits: true,
    initialValue: "#24543c",
  },
  {
    name: "--rowan-color-forest-500",
    syntax: "*",
    inherits: true,
    initialValue: "#2f6a4d",
  },
  {
    name: "--rowan-color-sand-50",
    syntax: "*",
    inherits: true,
    initialValue: "#f8f7f2",
  },
  {
    name: "--rowan-color-sand-100",
    syntax: "*",
    inherits: true,
    initialValue: "#efede4",
  },
  {
    name: "--rowan-color-ink-900",
    syntax: "*",
    inherits: true,
    initialValue: "#1f2421",
  },
  {
    name: "--rowan-color-ink-700",
    syntax: "*",
    inherits: true,
    initialValue: "#424945",
  },
  {
    name: "--rowan-color-danger-600",
    syntax: "*",
    inherits: true,
    initialValue: "#b4392d",
  },
  {
    name: "--rowan-color-danger-700",
    syntax: "*",
    inherits: true,
    initialValue: "#972d22",
  },
  {
    name: "--rowan-space-1",
    syntax: "*",
    inherits: true,
    initialValue: "0.25rem",
  },
  {
    name: "--rowan-space-2",
    syntax: "*",
    inherits: true,
    initialValue: "0.5rem",
  },
  {
    name: "--rowan-space-3",
    syntax: "*",
    inherits: true,
    initialValue: "0.75rem",
  },
  {
    name: "--rowan-space-4",
    syntax: "*",
    inherits: true,
    initialValue: "1rem",
  },
  {
    name: "--rowan-space-5",
    syntax: "*",
    inherits: true,
    initialValue: "1.25rem",
  },
  {
    name: "--rowan-space-6",
    syntax: "*",
    inherits: true,
    initialValue: "1.5rem",
  },
  {
    name: "--rowan-space-8",
    syntax: "*",
    inherits: true,
    initialValue: "2rem",
  },
  {
    name: "--rowan-radius-sm",
    syntax: "*",
    inherits: true,
    initialValue: "0.375rem",
  },
  {
    name: "--rowan-radius-md",
    syntax: "*",
    inherits: true,
    initialValue: "0.5rem",
  },
  {
    name: "--rowan-radius-lg",
    syntax: "*",
    inherits: true,
    initialValue: "0.625rem",
  },
  {
    name: "--rowan-font-family",
    syntax: "*",
    inherits: true,
    initialValue: '"Avenir Next", "Segoe UI", "Noto Sans", sans-serif',
  },
  {
    name: "--rowan-font-size-sm",
    syntax: "*",
    inherits: true,
    initialValue: "0.875rem",
  },
  {
    name: "--rowan-font-size-md",
    syntax: "*",
    inherits: true,
    initialValue: "1rem",
  },
  {
    name: "--rowan-font-size-lg",
    syntax: "*",
    inherits: true,
    initialValue: "1.125rem",
  },
  {
    name: "--rowan-line-height",
    syntax: "*",
    inherits: true,
    initialValue: "1.4",
  },
  {
    name: "--rowan-border-width",
    syntax: "*",
    inherits: true,
    initialValue: "1px",
  },
  {
    name: "--rowan-color-bg",
    syntax: "*",
    inherits: true,
    initialValue: "#f8f7f2",
  },
  {
    name: "--rowan-color-fg",
    syntax: "*",
    inherits: true,
    initialValue: "#1f2421",
  },
  {
    name: "--rowan-color-muted",
    syntax: "*",
    inherits: true,
    initialValue: "#424945",
  },
  {
    name: "--rowan-color-accent",
    syntax: "*",
    inherits: true,
    initialValue: "#1d432f",
  },
  {
    name: "--rowan-color-border",
    syntax: "*",
    inherits: true,
    initialValue: "#d8dcd5",
  },
  {
    name: "--rowan-color-danger",
    syntax: "*",
    inherits: true,
    initialValue: "#b4392d",
  },
  {
    name: "--rowan-color-success",
    syntax: "*",
    inherits: true,
    initialValue: "#2f7a4d",
  },
  {
    name: "--rowan-color-warning",
    syntax: "*",
    inherits: true,
    initialValue: "#9b7018",
  },
  {
    name: "--rowan-color-surface",
    syntax: "*",
    inherits: true,
    initialValue: "#f8f7f2",
  },
  {
    name: "--rowan-color-accent-contrast",
    syntax: "*",
    inherits: true,
    initialValue: "#f8f7f2",
  },
];

function registerTokenProperties() {
  if (typeof CSS === "undefined" || typeof CSS.registerProperty !== "function") {
    return false;
  }

  for (const definition of tokenPropertyDefinitions) {
    try {
      CSS.registerProperty(definition);
    } catch (error) {
      if (error?.name !== "InvalidModificationError") {
        return false;
      }
    }
  }

  return true;
}

export const tokenPropertiesRegistered = registerTokenProperties();

export const documentTokenSentinels = [
  "--rowan-color-bg",
  "--rowan-color-fg",
  "--rowan-color-accent",
  "--rowan-color-border",
  "--rowan-font-family",
  "--rowan-space-1",
];
