import { createIcon } from "../icon.js";

const definition = {
  name: "strikethrough",
  nodes: [
    [
      "path",
      {
        d: "M16 4H9a3 3 0 0 0-2.83 4",
      },
    ],
    [
      "path",
      {
        d: "M14 12a4 4 0 0 1 0 8H6",
      },
    ],
    [
      "line",
      {
        x1: "4",
        x2: "20",
        y1: "12",
        y2: "12",
      },
    ],
  ],
};

/**
 * Creates the strikethrough icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Strikethrough(options) {
  return createIcon(definition, options);
}

export default Strikethrough;
