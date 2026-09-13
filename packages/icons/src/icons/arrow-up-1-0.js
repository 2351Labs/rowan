import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-up-1-0",
  nodes: [
    [
      "path",
      {
        d: "m3 8 4-4 4 4",
      },
    ],
    [
      "path",
      {
        d: "M7 4v16",
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
 * Creates the arrow-up-1-0 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowUp1To0(options) {
  return createIcon(definition, options);
}

export default ArrowUp1To0;
