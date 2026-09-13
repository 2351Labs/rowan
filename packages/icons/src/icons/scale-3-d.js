import { createIcon } from "../icon.js";

const definition = {
  name: "scale-3-d",
  nodes: [
    [
      "path",
      {
        d: "M5 7v11a1 1 0 0 0 1 1h11",
      },
    ],
    [
      "path",
      {
        d: "M5.293 18.707 11 13",
      },
    ],
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
  ],
};

/**
 * Creates the scale-3-d icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Scale3D(options) {
  return createIcon(definition, options);
}

export default Scale3D;
