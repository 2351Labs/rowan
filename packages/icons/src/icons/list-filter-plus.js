import { createIcon } from "../icon.js";

const definition = {
  name: "list-filter-plus",
  nodes: [
    [
      "path",
      {
        d: "M12 5H2",
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
    [
      "path",
      {
        d: "M16 5h6",
      },
    ],
    [
      "path",
      {
        d: "M19 8V2",
      },
    ],
  ],
};

/**
 * Creates the list-filter-plus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ListFilterPlus(options) {
  return createIcon(definition, options);
}

export default ListFilterPlus;
