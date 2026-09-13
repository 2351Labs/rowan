import { createIcon } from "../icon.js";

const definition = {
  name: "squares-unite",
  nodes: [
    [
      "path",
      {
        d: "M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3a1 1 0 0 0 1 1h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-3a1 1 0 0 0-1-1z",
      },
    ],
  ],
};

/**
 * Creates the squares-unite icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquaresUnite(options) {
  return createIcon(definition, options);
}

export default SquaresUnite;
