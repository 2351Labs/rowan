import { createIcon } from "../icon.js";

const definition = {
  name: "spline",
  nodes: [
    [
      "circle",
      {
        cx: "19",
        cy: "5",
        r: "2",
      },
    ],
    [
      "circle",
      {
        cx: "5",
        cy: "19",
        r: "2",
      },
    ],
    [
      "path",
      {
        d: "M5 17A12 12 0 0 1 17 5",
      },
    ],
  ],
};

/**
 * Creates the spline icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Spline(options) {
  return createIcon(definition, options);
}

export default Spline;
