import { createIcon } from "../icon.js";

const definition = {
  name: "monitor",
  nodes: [
    [
      "rect",
      {
        width: "20",
        height: "14",
        x: "2",
        y: "3",
        rx: "2",
      },
    ],
    [
      "line",
      {
        x1: "8",
        x2: "16",
        y1: "21",
        y2: "21",
      },
    ],
    [
      "line",
      {
        x1: "12",
        x2: "12",
        y1: "17",
        y2: "21",
      },
    ],
  ],
};

/**
 * Creates the monitor icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Monitor(options) {
  return createIcon(definition, options);
}

export default Monitor;
