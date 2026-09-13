import { createIcon } from "../icon.js";

const definition = {
  name: "spell-check",
  nodes: [
    [
      "path",
      {
        d: "m20 15-5.5 5.5L12 18",
      },
    ],
    [
      "path",
      {
        d: "m4 16 6-12 5.115 10.23",
      },
    ],
    [
      "path",
      {
        d: "M6 12h8",
      },
    ],
  ],
};

/**
 * Creates the spell-check icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SpellCheck(options) {
  return createIcon(definition, options);
}

export default SpellCheck;
