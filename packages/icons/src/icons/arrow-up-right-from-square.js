import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-up-right-from-square",
  nodes: [
    [
      "path",
      {
        d: "M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6",
      },
    ],
    [
      "path",
      {
        d: "m21 3-9 9",
      },
    ],
    [
      "path",
      {
        d: "M15 3h6v6",
      },
    ],
  ],
};

/**
 * Creates the arrow-up-right-from-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowUpRightFromSquare(options) {
  return createIcon(definition, options);
}

export default ArrowUpRightFromSquare;
