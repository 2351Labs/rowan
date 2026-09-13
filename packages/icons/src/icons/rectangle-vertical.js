import { createIcon } from "../icon.js";

const definition = {
  name: "rectangle-vertical",
  nodes: [
    [
      "rect",
      {
        width: "12",
        height: "20",
        x: "6",
        y: "2",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the rectangle-vertical icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function RectangleVertical(options) {
  return createIcon(definition, options);
}

export default RectangleVertical;
