import { createIcon } from "../icon.js";

const definition = {
  name: "list-tree",
  nodes: [
    [
      "path",
      {
        d: "M8 5h13",
      },
    ],
    [
      "path",
      {
        d: "M13 12h8",
      },
    ],
    [
      "path",
      {
        d: "M13 19h8",
      },
    ],
    [
      "path",
      {
        d: "M3 10a2 2 0 0 0 2 2h3",
      },
    ],
    [
      "path",
      {
        d: "M3 5v12a2 2 0 0 0 2 2h3",
      },
    ],
  ],
};

/**
 * Creates the list-tree icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ListTree(options) {
  return createIcon(definition, options);
}

export default ListTree;
