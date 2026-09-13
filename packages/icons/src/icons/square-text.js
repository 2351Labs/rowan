import { createIcon } from "../icon.js";

const definition = {
  name: "square-text",
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
        d: "M7 8h8",
      },
    ],
    [
      "path",
      {
        d: "M7 12h10",
      },
    ],
    [
      "path",
      {
        d: "M7 16h6",
      },
    ],
  ],
};

/**
 * Creates the square-text icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareText(options) {
  return createIcon(definition, options);
}

export default SquareText;
