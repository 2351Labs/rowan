import { createIcon } from "../icon.js";

const definition = {
  name: "baseline",
  nodes: [
    [
      "path",
      {
        d: "M4 20h16",
      },
    ],
    [
      "path",
      {
        d: "m6 16 6-12 6 12",
      },
    ],
    [
      "path",
      {
        d: "M8 12h8",
      },
    ],
  ],
};

/**
 * Creates the baseline icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Baseline(options) {
  return createIcon(definition, options);
}

export default Baseline;
