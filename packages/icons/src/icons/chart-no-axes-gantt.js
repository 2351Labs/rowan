import { createIcon } from "../icon.js";

const definition = {
  name: "chart-no-axes-gantt",
  nodes: [
    [
      "path",
      {
        d: "M6 5h12",
      },
    ],
    [
      "path",
      {
        d: "M4 12h10",
      },
    ],
    [
      "path",
      {
        d: "M12 19h8",
      },
    ],
  ],
};

/**
 * Creates the chart-no-axes-gantt icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChartNoAxesGantt(options) {
  return createIcon(definition, options);
}

export default ChartNoAxesGantt;
