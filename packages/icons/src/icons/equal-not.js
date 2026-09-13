import { createIcon } from "../icon.js";

const definition = {
  name: "equal-not",
  nodes: [
    [
      "line",
      {
        x1: "5",
        x2: "19",
        y1: "9",
        y2: "9",
      },
    ],
    [
      "line",
      {
        x1: "5",
        x2: "19",
        y1: "15",
        y2: "15",
      },
    ],
    [
      "line",
      {
        x1: "19",
        x2: "5",
        y1: "5",
        y2: "19",
      },
    ],
  ],
};

/**
 * Creates the equal-not icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function EqualNot(options) {
  return createIcon(definition, options);
}

export default EqualNot;
