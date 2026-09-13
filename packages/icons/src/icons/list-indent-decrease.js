import { createIcon } from "../icon.js";

const definition = {
  name: "list-indent-decrease",
  nodes: [
    [
      "path",
      {
        d: "M21 5H11",
      },
    ],
    [
      "path",
      {
        d: "M21 12H11",
      },
    ],
    [
      "path",
      {
        d: "M21 19H11",
      },
    ],
    [
      "path",
      {
        d: "m7 8-4 4 4 4",
      },
    ],
  ],
};

/**
 * Creates the list-indent-decrease icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ListIndentDecrease(options) {
  return createIcon(definition, options);
}

export default ListIndentDecrease;
