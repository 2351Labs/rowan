import { createIcon } from "../icon.js";

const definition = {
  name: "search-x",
  nodes: [
    [
      "path",
      {
        d: "m13.5 8.5-5 5",
      },
    ],
    [
      "path",
      {
        d: "m8.5 8.5 5 5",
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
 * Creates the search-x icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SearchX(options) {
  return createIcon(definition, options);
}

export default SearchX;
