import { createIcon } from "../icon.js";

const definition = {
  name: "search",
  nodes: [
    [
      "path",
      {
        d: "m21 21-4.34-4.34",
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
 * Creates the search icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Search(options) {
  return createIcon(definition, options);
}

export default Search;
