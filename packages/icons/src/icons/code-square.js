import { createIcon } from "../icon.js";

const definition = {
  name: "code-square",
  nodes: [
    [
      "path",
      {
        d: "m10 9-3 3 3 3",
      },
    ],
    [
      "path",
      {
        d: "m14 15 3-3-3-3",
      },
    ],
    [
      "rect",
      {
        x: "3",
        y: "3",
        width: "18",
        height: "18",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the code-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CodeSquare(options) {
  return createIcon(definition, options);
}

export default CodeSquare;
