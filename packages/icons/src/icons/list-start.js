import { createIcon } from "../icon.js";

const definition = {
  name: "list-start",
  nodes: [
    [
      "path",
      {
        d: "M3 5h6",
      },
    ],
    [
      "path",
      {
        d: "M3 12h13",
      },
    ],
    [
      "path",
      {
        d: "M3 19h13",
      },
    ],
    [
      "path",
      {
        d: "m16 8-3-3 3-3",
      },
    ],
    [
      "path",
      {
        d: "M21 19V7a2 2 0 0 0-2-2h-6",
      },
    ],
  ],
};

/**
 * Creates the list-start icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ListStart(options) {
  return createIcon(definition, options);
}

export default ListStart;
