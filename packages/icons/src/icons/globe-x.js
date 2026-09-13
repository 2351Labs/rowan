import { createIcon } from "../icon.js";

const definition = {
  name: "globe-x",
  nodes: [
    [
      "path",
      {
        d: "m16 3 5 5",
      },
    ],
    [
      "path",
      {
        d: "M2 12h20A10 10 0 1 1 12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 4-10",
      },
    ],
    [
      "path",
      {
        d: "m21 3-5 5",
      },
    ],
  ],
};

/**
 * Creates the globe-x icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GlobeX(options) {
  return createIcon(definition, options);
}

export default GlobeX;
