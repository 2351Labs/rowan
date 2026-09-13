import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-left-right",
  nodes: [
    [
      "path",
      {
        d: "M8 3 4 7l4 4",
      },
    ],
    [
      "path",
      {
        d: "M4 7h16",
      },
    ],
    [
      "path",
      {
        d: "m16 21 4-4-4-4",
      },
    ],
    [
      "path",
      {
        d: "M20 17H4",
      },
    ],
  ],
};

/**
 * Creates the arrow-left-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowLeftRight(options) {
  return createIcon(definition, options);
}

export default ArrowLeftRight;
