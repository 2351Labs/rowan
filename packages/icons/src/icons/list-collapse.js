import { createIcon } from "../icon.js";

const definition = {
  name: "list-collapse",
  nodes: [
    [
      "path",
      {
        d: "M10 5h11",
      },
    ],
    [
      "path",
      {
        d: "M10 12h11",
      },
    ],
    [
      "path",
      {
        d: "M10 19h11",
      },
    ],
    [
      "path",
      {
        d: "m3 10 3-3-3-3",
      },
    ],
    [
      "path",
      {
        d: "m3 20 3-3-3-3",
      },
    ],
  ],
};

/**
 * Creates the list-collapse icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ListCollapse(options) {
  return createIcon(definition, options);
}

export default ListCollapse;
