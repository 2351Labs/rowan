import { createIcon } from "../icon.js";

const definition = {
  name: "list-ordered",
  nodes: [
    [
      "path",
      {
        d: "M11 5h10",
      },
    ],
    [
      "path",
      {
        d: "M11 12h10",
      },
    ],
    [
      "path",
      {
        d: "M11 19h10",
      },
    ],
    [
      "path",
      {
        d: "M4 4h1v5",
      },
    ],
    [
      "path",
      {
        d: "M4 9h2",
      },
    ],
    [
      "path",
      {
        d: "M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02",
      },
    ],
  ],
};

/**
 * Creates the list-ordered icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ListOrdered(options) {
  return createIcon(definition, options);
}

export default ListOrdered;
