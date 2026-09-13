import { createIcon } from "../icon.js";

const definition = {
  name: "separator-horizontal",
  nodes: [
    [
      "path",
      {
        d: "m16 16-4 4-4-4",
      },
    ],
    [
      "path",
      {
        d: "M3 12h18",
      },
    ],
    [
      "path",
      {
        d: "m8 8 4-4 4 4",
      },
    ],
  ],
};

/**
 * Creates the separator-horizontal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SeparatorHorizontal(options) {
  return createIcon(definition, options);
}

export default SeparatorHorizontal;
