import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-down-10",
  nodes: [
    [
      "path",
      {
        d: "m3 16 4 4 4-4",
      },
    ],
    [
      "path",
      {
        d: "M7 20V4",
      },
    ],
    [
      "path",
      {
        d: "M17 10V4h-2",
      },
    ],
    [
      "path",
      {
        d: "M15 10h4",
      },
    ],
    [
      "rect",
      {
        x: "15",
        y: "14",
        width: "4",
        height: "6",
        ry: "2",
      },
    ],
  ],
};

/**
 * Creates the arrow-down-10 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowDown10(options) {
  return createIcon(definition, options);
}

export default ArrowDown10;
