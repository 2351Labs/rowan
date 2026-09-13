import { createIcon } from "../icon.js";

const definition = {
  name: "list-x",
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
        d: "m15.5 9.5 5 5",
      },
    ],
    [
      "path",
      {
        d: "m20.5 9.5-5 5",
      },
    ],
  ],
};

/**
 * Creates the list-x icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ListX(options) {
  return createIcon(definition, options);
}

export default ListX;
