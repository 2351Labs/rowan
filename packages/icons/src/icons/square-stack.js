import { createIcon } from "../icon.js";

const definition = {
  name: "square-stack",
  nodes: [
    [
      "path",
      {
        d: "M4 10c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2",
      },
    ],
    [
      "path",
      {
        d: "M10 16c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2",
      },
    ],
    [
      "rect",
      {
        width: "8",
        height: "8",
        x: "14",
        y: "14",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the square-stack icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareStack(options) {
  return createIcon(definition, options);
}

export default SquareStack;
