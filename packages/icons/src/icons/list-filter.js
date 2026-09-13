import { createIcon } from "../icon.js";

const definition = {
  name: "list-filter",
  nodes: [
    [
      "path",
      {
        d: "M2 5h20",
      },
    ],
    [
      "path",
      {
        d: "M6 12h12",
      },
    ],
    [
      "path",
      {
        d: "M9 19h6",
      },
    ],
  ],
};

/**
 * Creates the list-filter icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ListFilter(options) {
  return createIcon(definition, options);
}

export default ListFilter;
