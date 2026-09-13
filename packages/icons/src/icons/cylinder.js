import { createIcon } from "../icon.js";

const definition = {
  name: "cylinder",
  nodes: [
    [
      "ellipse",
      {
        cx: "12",
        cy: "5",
        rx: "9",
        ry: "3",
      },
    ],
    [
      "path",
      {
        d: "M3 5v14a9 3 0 0 0 18 0V5",
      },
    ],
  ],
};

/**
 * Creates the cylinder icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Cylinder(options) {
  return createIcon(definition, options);
}

export default Cylinder;
