import { createIcon } from "../icon.js";

const definition = {
  name: "square-dimensions",
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
        d: "M12 7H7v5",
      },
    ],
    [
      "path",
      {
        d: "M12 17h5v-5",
      },
    ],
  ],
};

/**
 * Creates the square-dimensions icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareDimensions(options) {
  return createIcon(definition, options);
}

export default SquareDimensions;
