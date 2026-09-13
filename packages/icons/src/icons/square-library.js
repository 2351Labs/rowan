import { createIcon } from "../icon.js";

const definition = {
  name: "square-library",
  nodes: [
    [
      "rect",
      {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M7 7v10",
      },
    ],
    [
      "path",
      {
        d: "M11 7v10",
      },
    ],
    [
      "path",
      {
        d: "m15 7 2 10",
      },
    ],
  ],
};

/**
 * Creates the square-library icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareLibrary(options) {
  return createIcon(definition, options);
}

export default SquareLibrary;
