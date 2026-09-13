import { createIcon } from "../icon.js";

const definition = {
  name: "list-sort-ascending",
  nodes: [
    [
      "path",
      {
        d: "M3 19h18",
      },
    ],
    [
      "path",
      {
        d: "M15 12H3",
      },
    ],
    [
      "path",
      {
        d: "M9 5H3",
      },
    ],
  ],
};

/**
 * Creates the list-sort-ascending icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ListSortAscending(options) {
  return createIcon(definition, options);
}

export default ListSortAscending;
