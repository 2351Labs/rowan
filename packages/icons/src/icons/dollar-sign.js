import { createIcon } from "../icon.js";

const definition = {
  name: "dollar-sign",
  nodes: [
    [
      "line",
      {
        x1: "12",
        x2: "12",
        y1: "2",
        y2: "22",
      },
    ],
    [
      "path",
      {
        d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
      },
    ],
  ],
};

/**
 * Creates the dollar-sign icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function DollarSign(options) {
  return createIcon(definition, options);
}

export default DollarSign;
