import { createIcon } from "../icon.js";

const definition = {
  name: "equal-approximately-not",
  nodes: [
    [
      "path",
      {
        d: "M5 15a6.5 6.5 0 0 1 7 0 6.5 6.5 0 0 0 7 0",
      },
    ],
    [
      "path",
      {
        d: "M5 9a6.5 6.5 0 0 1 7 0 6.5 6.5 0 0 0 7 0",
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
 * Creates the equal-approximately-not icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function EqualApproximatelyNot(options) {
  return createIcon(definition, options);
}

export default EqualApproximatelyNot;
