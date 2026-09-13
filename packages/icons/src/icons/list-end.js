import { createIcon } from "../icon.js";

const definition = {
  name: "list-end",
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
        d: "M16 12H3",
      },
    ],
    [
      "path",
      {
        d: "M9 19H3",
      },
    ],
    [
      "path",
      {
        d: "m16 16-3 3 3 3",
      },
    ],
    [
      "path",
      {
        d: "M21 5v12a2 2 0 0 1-2 2h-6",
      },
    ],
  ],
};

/**
 * Creates the list-end icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ListEnd(options) {
  return createIcon(definition, options);
}

export default ListEnd;
