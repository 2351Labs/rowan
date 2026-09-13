import { createIcon } from "../icon.js";

const definition = {
  name: "chevron-right-square",
  nodes: [
    [
      "rect",
      {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "m10 8 4 4-4 4",
      },
    ],
  ],
};

/**
 * Creates the chevron-right-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChevronRightSquare(options) {
  return createIcon(definition, options);
}

export default ChevronRightSquare;
