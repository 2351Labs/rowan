import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-down-left-from-square",
  nodes: [
    [
      "path",
      {
        d: "M13 21h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6",
      },
    ],
    [
      "path",
      {
        d: "m3 21 9-9",
      },
    ],
    [
      "path",
      {
        d: "M9 21H3v-6",
      },
    ],
  ],
};

/**
 * Creates the arrow-down-left-from-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowDownLeftFromSquare(options) {
  return createIcon(definition, options);
}

export default ArrowDownLeftFromSquare;
