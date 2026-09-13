import { createIcon } from "../icon.js";

const definition = {
  name: "dice-1",
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
        d: "M12 12h.01",
      },
    ],
  ],
};

/**
 * Creates the dice-1 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Dice1(options) {
  return createIcon(definition, options);
}

export default Dice1;
