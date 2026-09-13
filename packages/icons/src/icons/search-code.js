import { createIcon } from "../icon.js";

const definition = {
  name: "search-code",
  nodes: [
    [
      "path",
      {
        d: "m13 13.5 2-2.5-2-2.5",
      },
    ],
    [
      "path",
      {
        d: "m21 21-4.3-4.3",
      },
    ],
    [
      "path",
      {
        d: "M9 8.5 7 11l2 2.5",
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
  ],
};

/**
 * Creates the search-code icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SearchCode(options) {
  return createIcon(definition, options);
}

export default SearchCode;
