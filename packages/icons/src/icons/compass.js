import { createIcon } from "../icon.js";

const definition = {
  name: "compass",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
    [
      "path",
      {
        d: "m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",
      },
    ],
  ],
};

/**
 * Creates the compass icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Compass(options) {
  return createIcon(definition, options);
}

export default Compass;
