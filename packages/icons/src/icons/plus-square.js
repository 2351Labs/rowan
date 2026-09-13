import { createIcon } from "../icon.js";

const definition = {
  name: "plus-square",
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
        d: "M8 12h8",
      },
    ],
    [
      "path",
      {
        d: "M12 8v8",
      },
    ],
  ],
};

/**
 * Creates the plus-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PlusSquare(options) {
  return createIcon(definition, options);
}

export default PlusSquare;
