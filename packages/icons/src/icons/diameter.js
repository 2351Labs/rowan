import { createIcon } from "../icon.js";

const definition = {
  name: "diameter",
  nodes: [
    [
      "circle",
      {
        cx: "19",
        cy: "19",
        r: "2",
      },
    ],
    [
      "circle",
      {
        cx: "5",
        cy: "5",
        r: "2",
      },
    ],
    [
      "path",
      {
        d: "M6.48 3.66a10 10 0 0 1 13.86 13.86",
      },
    ],
    [
      "path",
      {
        d: "m6.41 6.41 11.18 11.18",
      },
    ],
    [
      "path",
      {
        d: "M3.66 6.48a10 10 0 0 0 13.86 13.86",
      },
    ],
  ],
};

/**
 * Creates the diameter icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Diameter(options) {
  return createIcon(definition, options);
}

export default Diameter;
