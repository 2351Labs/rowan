import { createIcon } from "../icon.js";

const definition = {
  name: "lens-convex",
  nodes: [
    [
      "path",
      {
        d: "M13.433 2a1 1 0 0 1 .824.448 18 18 0 0 1 0 19.104 1 1 0 0 1-.824.448h-2.866a1 1 0 0 1-.824-.448 18 18 0 0 1 0-19.104A1 1 0 0 1 10.567 2z",
      },
    ],
  ],
};

/**
 * Creates the lens-convex icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function LensConvex(options) {
  return createIcon(definition, options);
}

export default LensConvex;
