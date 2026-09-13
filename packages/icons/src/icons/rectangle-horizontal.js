import { createIcon } from "../icon.js";

const definition = {
  name: "rectangle-horizontal",
  nodes: [
    [
      "rect",
      {
        width: "20",
        height: "12",
        x: "2",
        y: "6",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the rectangle-horizontal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function RectangleHorizontal(options) {
  return createIcon(definition, options);
}

export default RectangleHorizontal;
