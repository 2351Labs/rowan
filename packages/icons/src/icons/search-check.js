import { createIcon } from "../icon.js";

const definition = {
  name: "search-check",
  nodes: [
    [
      "path",
      {
        d: "m8 11 2 2 4-4",
      },
    ],
    [
      "circle",
      {
        cx: "11",
        cy: "11",
        r: "8",
      },
    ],
    [
      "path",
      {
        d: "m21 21-4.3-4.3",
      },
    ],
  ],
};

/**
 * Creates the search-check icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SearchCheck(options) {
  return createIcon(definition, options);
}

export default SearchCheck;
