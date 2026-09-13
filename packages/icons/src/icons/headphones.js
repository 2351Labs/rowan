import { createIcon } from "../icon.js";

const definition = {
  name: "headphones",
  nodes: [
    [
      "path",
      {
        d: "M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3",
      },
    ],
  ],
};

/**
 * Creates the headphones icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Headphones(options) {
  return createIcon(definition, options);
}

export default Headphones;
