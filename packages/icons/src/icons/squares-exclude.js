import { createIcon } from "../icon.js";

const definition = {
  name: "squares-exclude",
  nodes: [
    [
      "path",
      {
        d: "M16 12v2a2 2 0 0 1-2 2H9a1 1 0 0 0-1 1v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h0",
      },
    ],
    [
      "path",
      {
        d: "M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3a1 1 0 0 1-1 1h-5a2 2 0 0 0-2 2v2",
      },
    ],
  ],
};

/**
 * Creates the squares-exclude icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquaresExclude(options) {
  return createIcon(definition, options);
}

export default SquaresExclude;
