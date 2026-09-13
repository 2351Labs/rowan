import { createIcon } from "../icon.js";

const definition = {
  name: "text-search",
  nodes: [
    [
      "path",
      {
        d: "M21 5H3",
      },
    ],
    [
      "path",
      {
        d: "M10 12H3",
      },
    ],
    [
      "path",
      {
        d: "M10 19H3",
      },
    ],
    [
      "circle",
      {
        cx: "17",
        cy: "15",
        r: "3",
      },
    ],
    [
      "path",
      {
        d: "m21 19-1.9-1.9",
      },
    ],
  ],
};

/**
 * Creates the text-search icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TextSearch(options) {
  return createIcon(definition, options);
}

export default TextSearch;
