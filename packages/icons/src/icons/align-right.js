import { createIcon } from "../icon.js";

const definition = {
  name: "align-right",
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
 * Creates the align-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AlignRight(options) {
  return createIcon(definition, options);
}

export default AlignRight;
