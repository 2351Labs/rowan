import { createIcon } from "../icon.js";

const definition = {
  name: "gantt-chart",
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
 * Creates the gantt-chart icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GanttChart(options) {
  return createIcon(definition, options);
}

export default GanttChart;
