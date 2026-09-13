import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-right-left",
  nodes: [
    [
      "path",
      {
        d: "m16 3 4 4-4 4",
      },
    ],
    [
      "path",
      {
        d: "M20 7H4",
      },
    ],
    [
      "path",
      {
        d: "m8 21-4-4 4-4",
      },
    ],
    [
      "path",
      {
        d: "M4 17h16",
      },
    ],
  ],
};

/**
 * Creates the arrow-right-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowRightLeft(options) {
  return createIcon(definition, options);
}

export default ArrowRightLeft;
