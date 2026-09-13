import { createIcon } from "../icon.js";

const definition = {
  name: "dice-2",
  nodes: [
    [
      "rect",
      {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2",
        ry: "2",
      },
    ],
    [
      "path",
      {
        d: "M15 9h.01",
      },
    ],
    [
      "path",
      {
        d: "M9 15h.01",
      },
    ],
  ],
};

/**
 * Creates the dice-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Dice2(options) {
  return createIcon(definition, options);
}

export default Dice2;
