import { createIcon } from "../icon.js";

const definition = {
  name: "search-alert",
  nodes: [
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
    [
      "path",
      {
        d: "M11 7v4",
      },
    ],
    [
      "path",
      {
        d: "M11 15h.01",
      },
    ],
  ],
};

/**
 * Creates the search-alert icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SearchAlert(options) {
  return createIcon(definition, options);
}

export default SearchAlert;
