import { createIcon } from "../icon.js";

const definition = {
  name: "align-left",
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
 * Creates the align-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AlignLeft(options) {
  return createIcon(definition, options);
}

export default AlignLeft;
