import { createIcon } from "../icon.js";

const definition = {
  name: "list-chevrons-down-up",
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
        d: "m15 5 3 3 3-3",
      },
    ],
    [
      "path",
      {
        d: "m15 19 3-3 3 3",
      },
    ],
  ],
};

/**
 * Creates the list-chevrons-down-up icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ListChevronsDownUp(options) {
  return createIcon(definition, options);
}

export default ListChevronsDownUp;
