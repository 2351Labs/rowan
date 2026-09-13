import { createIcon } from "../icon.js";

const definition = {
  name: "chart-no-axes-combined",
  nodes: [
    [
      "path",
      {
        d: "M12 16v5",
      },
    ],
    [
      "path",
      {
        d: "M16 14.639V21",
      },
    ],
    [
      "path",
      {
        d: "M20 10.656V21",
      },
    ],
    [
      "path",
      {
        d: "m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15",
      },
    ],
    [
      "path",
      {
        d: "M4 18.463V21",
      },
    ],
    [
      "path",
      {
        d: "M8 14.656V21",
      },
    ],
  ],
};

/**
 * Creates the chart-no-axes-combined icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChartNoAxesCombined(options) {
  return createIcon(definition, options);
}

export default ChartNoAxesCombined;
