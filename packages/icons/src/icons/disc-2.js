import { createIcon } from "../icon.js";

const definition = {
  name: "disc-2",
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
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "4",
      },
    ],
    [
      "path",
      {
        d: "M12 12h.01",
      },
    ],
  ],
};

/**
 * Creates the disc-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Disc2(options) {
  return createIcon(definition, options);
}

export default Disc2;
