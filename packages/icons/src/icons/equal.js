import { createIcon } from "../icon.js";

const definition = {
  name: "equal",
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
  ],
};

/**
 * Creates the equal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Equal(options) {
  return createIcon(definition, options);
}

export default Equal;
