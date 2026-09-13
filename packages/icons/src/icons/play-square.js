import { createIcon } from "../icon.js";

const definition = {
  name: "play-square",
  nodes: [
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
    [
      "path",
      {
        d: "M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",
      },
    ],
  ],
};

/**
 * Creates the play-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PlaySquare(options) {
  return createIcon(definition, options);
}

export default PlaySquare;
