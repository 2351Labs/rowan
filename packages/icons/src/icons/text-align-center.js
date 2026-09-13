import { createIcon } from "../icon.js";

const definition = {
  name: "text-align-center",
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
        d: "M17 12H7",
      },
    ],
    [
      "path",
      {
        d: "M19 19H5",
      },
    ],
  ],
};

/**
 * Creates the text-align-center icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TextAlignCenter(options) {
  return createIcon(definition, options);
}

export default TextAlignCenter;
