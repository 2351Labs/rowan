import { createIcon } from "../icon.js";

const definition = {
  name: "chevron-down-square",
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
        d: "m16 10-4 4-4-4",
      },
    ],
  ],
};

/**
 * Creates the chevron-down-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChevronDownSquare(options) {
  return createIcon(definition, options);
}

export default ChevronDownSquare;
