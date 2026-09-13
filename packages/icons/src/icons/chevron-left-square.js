import { createIcon } from "../icon.js";

const definition = {
  name: "chevron-left-square",
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
        d: "m14 16-4-4 4-4",
      },
    ],
  ],
};

/**
 * Creates the chevron-left-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChevronLeftSquare(options) {
  return createIcon(definition, options);
}

export default ChevronLeftSquare;
