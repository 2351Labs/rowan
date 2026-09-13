import { createIcon } from "../icon.js";

const definition = {
  name: "grid-2x2",
  nodes: [
    [
      "path",
      {
        d: "M12 3v18",
      },
    ],
    [
      "path",
      {
        d: "M3 12h18",
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
 * Creates the grid-2x2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Grid2x2(options) {
  return createIcon(definition, options);
}

export default Grid2x2;
