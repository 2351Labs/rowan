import { createIcon } from "../icon.js";

const definition = {
  name: "square-dot",
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
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "1",
      },
    ],
  ],
};

/**
 * Creates the square-dot icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareDot(options) {
  return createIcon(definition, options);
}

export default SquareDot;
