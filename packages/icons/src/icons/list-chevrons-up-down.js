import { createIcon } from "../icon.js";

const definition = {
  name: "list-chevrons-up-down",
  nodes: [
    [
      "path",
      {
        d: "M3 5h8",
      },
    ],
    [
      "path",
      {
        d: "M3 12h8",
      },
    ],
    [
      "path",
      {
        d: "M3 19h8",
      },
    ],
    [
      "path",
      {
        d: "m15 8 3-3 3 3",
      },
    ],
    [
      "path",
      {
        d: "m15 16 3 3 3-3",
      },
    ],
  ],
};

/**
 * Creates the list-chevrons-up-down icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ListChevronsUpDown(options) {
  return createIcon(definition, options);
}

export default ListChevronsUpDown;
