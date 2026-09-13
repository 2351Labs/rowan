import { createIcon } from "../icon.js";

const definition = {
  name: "dice-5",
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
        d: "M16 8h.01",
      },
    ],
    [
      "path",
      {
        d: "M8 8h.01",
      },
    ],
    [
      "path",
      {
        d: "M8 16h.01",
      },
    ],
    [
      "path",
      {
        d: "M16 16h.01",
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
 * Creates the dice-5 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Dice5(options) {
  return createIcon(definition, options);
}

export default Dice5;
