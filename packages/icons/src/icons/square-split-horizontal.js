import { createIcon } from "../icon.js";

const definition = {
  name: "square-split-horizontal",
  nodes: [
    [
      "path",
      {
        d: "M12 2v20",
      },
    ],
    [
      "path",
      {
        d: "M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3",
      },
    ],
    [
      "path",
      {
        d: "M8 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3",
      },
    ],
  ],
};

/**
 * Creates the square-split-horizontal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareSplitHorizontal(options) {
  return createIcon(definition, options);
}

export default SquareSplitHorizontal;
