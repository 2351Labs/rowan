import { createIcon } from "../icon.js";

const definition = {
  name: "list-check",
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
        d: "M11 19H3",
      },
    ],
    [
      "path",
      {
        d: "m15 18 2 2 4-4",
      },
    ],
  ],
};

/**
 * Creates the list-check icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ListCheck(options) {
  return createIcon(definition, options);
}

export default ListCheck;
