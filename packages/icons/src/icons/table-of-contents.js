import { createIcon } from "../icon.js";

const definition = {
  name: "table-of-contents",
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
        d: "M16 19H3",
      },
    ],
    [
      "path",
      {
        d: "M21 5h.01",
      },
    ],
    [
      "path",
      {
        d: "M21 12h.01",
      },
    ],
    [
      "path",
      {
        d: "M21 19h.01",
      },
    ],
  ],
};

/**
 * Creates the table-of-contents icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TableOfContents(options) {
  return createIcon(definition, options);
}

export default TableOfContents;
