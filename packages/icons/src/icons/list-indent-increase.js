import { createIcon } from "../icon.js";

const definition = {
  name: "list-indent-increase",
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
        d: "m3 8 4 4-4 4",
      },
    ],
  ],
};

/**
 * Creates the list-indent-increase icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ListIndentIncrease(options) {
  return createIcon(definition, options);
}

export default ListIndentIncrease;
