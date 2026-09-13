import { createIcon } from "../icon.js";

const definition = {
  name: "mirror-rectangular",
  nodes: [
    [
      "path",
      {
        d: "M11 6 8 9",
      },
    ],
    [
      "path",
      {
        d: "m16 7-8 8",
      },
    ],
    [
      "rect",
      {
        x: "4",
        y: "2",
        width: "16",
        height: "20",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the mirror-rectangular icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MirrorRectangular(options) {
  return createIcon(definition, options);
}

export default MirrorRectangular;
