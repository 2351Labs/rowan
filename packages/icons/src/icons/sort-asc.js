import { createIcon } from "../icon.js";

const definition = {
  name: "sort-asc",
  nodes: [
    [
      "path",
      {
        d: "m3 8 4-4 4 4",
      },
    ],
    [
      "path",
      {
        d: "M7 4v16",
      },
    ],
    [
      "path",
      {
        d: "M11 12h4",
      },
    ],
    [
      "path",
      {
        d: "M11 16h7",
      },
    ],
    [
      "path",
      {
        d: "M11 20h10",
      },
    ],
  ],
};

/**
 * Creates the sort-asc icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SortAsc(options) {
  return createIcon(definition, options);
}

export default SortAsc;
