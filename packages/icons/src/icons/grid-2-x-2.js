import { createIcon } from "../icon.js";

const definition = {
  name: "grid-2-x-2",
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
 * Creates the grid-2-x-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Grid2X2(options) {
  return createIcon(definition, options);
}

export default Grid2X2;
