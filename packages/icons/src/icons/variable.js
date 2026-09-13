import { createIcon } from "../icon.js";

const definition = {
  name: "variable",
  nodes: [
    [
      "path",
      {
        d: "M8 21s-4-3-4-9 4-9 4-9",
      },
    ],
    [
      "path",
      {
        d: "M16 3s4 3 4 9-4 9-4 9",
      },
    ],
    [
      "line",
      {
        x1: "15",
        x2: "9",
        y1: "9",
        y2: "15",
      },
    ],
    [
      "line",
      {
        x1: "9",
        x2: "15",
        y1: "9",
        y2: "15",
      },
    ],
  ],
};

/**
 * Creates the variable icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Variable(options) {
  return createIcon(definition, options);
}

export default Variable;
