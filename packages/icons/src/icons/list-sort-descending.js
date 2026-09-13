import { createIcon } from "../icon.js";

const definition = {
  name: "list-sort-descending",
  nodes: [
    [
      "path",
      {
        d: "M15 12H3",
      },
    ],
    [
      "path",
      {
        d: "M3 5h18",
      },
    ],
    [
      "path",
      {
        d: "M9 19H3",
      },
    ],
  ],
};

/**
 * Creates the list-sort-descending icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ListSortDescending(options) {
  return createIcon(definition, options);
}

export default ListSortDescending;
