import { createIcon } from "../icon.js";

const definition = {
  name: "disc-3",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
    [
      "path",
      {
        d: "M6 12c0-1.7.7-3.2 1.8-4.2",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "2",
      },
    ],
    [
      "path",
      {
        d: "M18 12c0 1.7-.7 3.2-1.8 4.2",
      },
    ],
  ],
};

/**
 * Creates the disc-3 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Disc3(options) {
  return createIcon(definition, options);
}

export default Disc3;
