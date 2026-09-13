import { createIcon } from "../icon.js";

const definition = {
  name: "tree-deciduous",
  nodes: [
    [
      "path",
      {
        d: "M8 19a4 4 0 0 1-2.24-7.32A3.5 3.5 0 0 1 9 6.03V6a3 3 0 1 1 6 0v.04a3.5 3.5 0 0 1 3.24 5.65A4 4 0 0 1 16 19Z",
      },
    ],
    [
      "path",
      {
        d: "M12 19v3",
      },
    ],
  ],
};

/**
 * Creates the tree-deciduous icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TreeDeciduous(options) {
  return createIcon(definition, options);
}

export default TreeDeciduous;
