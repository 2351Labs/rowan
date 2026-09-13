import { createIcon } from "../icon.js";

const definition = {
  name: "ellipse",
  nodes: [
    [
      "ellipse",
      {
        cx: "12",
        cy: "12",
        rx: "10",
        ry: "6",
      },
    ],
  ],
};

/**
 * Creates the ellipse icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Ellipse(options) {
  return createIcon(definition, options);
}

export default Ellipse;
