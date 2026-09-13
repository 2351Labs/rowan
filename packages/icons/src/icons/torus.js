import { createIcon } from "../icon.js";

const definition = {
  name: "torus",
  nodes: [
    [
      "ellipse",
      {
        cx: "12",
        cy: "11",
        rx: "3",
        ry: "2",
      },
    ],
    [
      "ellipse",
      {
        cx: "12",
        cy: "12.5",
        rx: "10",
        ry: "8.5",
      },
    ],
  ],
};

/**
 * Creates the torus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Torus(options) {
  return createIcon(definition, options);
}

export default Torus;
