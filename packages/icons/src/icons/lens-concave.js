import { createIcon } from "../icon.js";

const definition = {
  name: "lens-concave",
  nodes: [
    [
      "path",
      {
        d: "M7 2a1 1 0 0 0-.8 1.6 14 14 0 0 1 0 16.8A1 1 0 0 0 7 22h10a1 1 0 0 0 .8-1.6 14 14 0 0 1 0-16.8A1 1 0 0 0 17 2z",
      },
    ],
  ],
};

/**
 * Creates the lens-concave icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function LensConcave(options) {
  return createIcon(definition, options);
}

export default LensConcave;
