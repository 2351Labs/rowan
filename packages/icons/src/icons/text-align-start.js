import { createIcon } from "../icon.js";

const definition = {
  name: "text-align-start",
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
        d: "M15 12H3",
      },
    ],
    [
      "path",
      {
        d: "M17 19H3",
      },
    ],
  ],
};

/**
 * Creates the text-align-start icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TextAlignStart(options) {
  return createIcon(definition, options);
}

export default TextAlignStart;
