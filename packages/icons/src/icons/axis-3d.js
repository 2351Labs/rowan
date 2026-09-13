import { createIcon } from "../icon.js";

const definition = {
  name: "axis-3d",
  nodes: [
    [
      "path",
      {
        d: "M13.5 10.5 15 9",
      },
    ],
    [
      "path",
      {
        d: "M4 4v15a1 1 0 0 0 1 1h15",
      },
    ],
    [
      "path",
      {
        d: "M4.293 19.707 6 18",
      },
    ],
    [
      "path",
      {
        d: "m9 15 1.5-1.5",
      },
    ],
  ],
};

/**
 * Creates the axis-3d icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Axis3d(options) {
  return createIcon(definition, options);
}

export default Axis3d;
