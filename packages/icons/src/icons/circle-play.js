import { createIcon } from "../icon.js";

const definition = {
  name: "circle-play",
  nodes: [
    [
      "path",
      {
        d: "M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
  ],
};

/**
 * Creates the circle-play icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CirclePlay(options) {
  return createIcon(definition, options);
}

export default CirclePlay;
