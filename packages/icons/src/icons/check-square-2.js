import { createIcon } from "../icon.js";

const definition = {
  name: "check-square-2",
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
        d: "m16 9-5.5 5.5L8 12",
      },
    ],
  ],
};

/**
 * Creates the check-square-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CheckSquare2(options) {
  return createIcon(definition, options);
}

export default CheckSquare2;
