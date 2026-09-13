import { createIcon } from "../icon.js";

const definition = {
  name: "cone",
  nodes: [
    [
      "path",
      {
        d: "m20.9 18.55-8-15.98a1 1 0 0 0-1.8 0l-8 15.98",
      },
    ],
    [
      "ellipse",
      {
        cx: "12",
        cy: "19",
        rx: "9",
        ry: "3",
      },
    ],
  ],
};

/**
 * Creates the cone icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Cone(options) {
  return createIcon(definition, options);
}

export default Cone;
