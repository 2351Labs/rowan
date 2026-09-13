import { createIcon } from "../icon.js";

const definition = {
  name: "split-square-vertical",
  nodes: [
    [
      "path",
      {
        d: "M2 12h20",
      },
    ],
    [
      "path",
      {
        d: "M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3",
      },
    ],
    [
      "path",
      {
        d: "M3 8V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3",
      },
    ],
  ],
};

/**
 * Creates the split-square-vertical icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SplitSquareVertical(options) {
  return createIcon(definition, options);
}

export default SplitSquareVertical;
