import { createIcon } from "../icon.js";

const definition = {
  name: "radical",
  nodes: [
    [
      "path",
      {
        d: "M3 12h3.28a1 1 0 0 1 .948.684l2.298 7.934a.5.5 0 0 0 .96-.044L13.82 4.771A1 1 0 0 1 14.792 4H21",
      },
    ],
  ],
};

/**
 * Creates the radical icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Radical(options) {
  return createIcon(definition, options);
}

export default Radical;
