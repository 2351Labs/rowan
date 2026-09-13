import { createIcon } from "../icon.js";

const definition = {
  name: "list-plus",
  nodes: [
    [
      "path",
      {
        d: "M16 5H3",
      },
    ],
    [
      "path",
      {
        d: "M11 12H3",
      },
    ],
    [
      "path",
      {
        d: "M16 19H3",
      },
    ],
    [
      "path",
      {
        d: "M18 9v6",
      },
    ],
    [
      "path",
      {
        d: "M21 12h-6",
      },
    ],
  ],
};

/**
 * Creates the list-plus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ListPlus(options) {
  return createIcon(definition, options);
}

export default ListPlus;
