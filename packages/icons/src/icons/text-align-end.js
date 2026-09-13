import { createIcon } from "../icon.js";

const definition = {
  name: "text-align-end",
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
        d: "M21 12H9",
      },
    ],
    [
      "path",
      {
        d: "M21 19H7",
      },
    ],
  ],
};

/**
 * Creates the text-align-end icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TextAlignEnd(options) {
  return createIcon(definition, options);
}

export default TextAlignEnd;
