import { createIcon } from "../icon.js";

const definition = {
  name: "square-menu",
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
        d: "M7 8h10",
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
        d: "M7 16h10",
      },
    ],
  ],
};

/**
 * Creates the square-menu icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareMenu(options) {
  return createIcon(definition, options);
}

export default SquareMenu;
