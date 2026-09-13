import { createIcon } from "../icon.js";

const definition = {
  name: "triangle-right",
  nodes: [
    [
      "path",
      {
        d: "M22 18a2 2 0 0 1-2 2H3c-1.1 0-1.3-.6-.4-1.3L20.4 4.3c.9-.7 1.6-.4 1.6.7Z",
      },
    ],
  ],
};

/**
 * Creates the triangle-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TriangleRight(options) {
  return createIcon(definition, options);
}

export default TriangleRight;
