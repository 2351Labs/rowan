import { createIcon } from "../icon.js";

const definition = {
  name: "fish-symbol",
  nodes: [
    [
      "path",
      {
        d: "M2 16s9-15 20-4C11 23 2 8 2 8",
      },
    ],
  ],
};

/**
 * Creates the fish-symbol icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FishSymbol(options) {
  return createIcon(definition, options);
}

export default FishSymbol;
