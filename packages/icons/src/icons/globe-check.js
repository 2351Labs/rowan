import { createIcon } from "../icon.js";

const definition = {
  name: "globe-check",
  nodes: [
    [
      "path",
      {
        d: "m15 6 2 2 4-4",
      },
    ],
    [
      "path",
      {
        d: "M2 12h20A10 10 0 1 1 12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 4-10",
      },
    ],
  ],
};

/**
 * Creates the globe-check icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GlobeCheck(options) {
  return createIcon(definition, options);
}

export default GlobeCheck;
