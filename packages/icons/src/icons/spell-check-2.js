import { createIcon } from "../icon.js";

const definition = {
  name: "spell-check-2",
  nodes: [
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
    [
      "path",
      {
        d: "M4 21c1.1 0 1.1-1 2.3-1s1.1 1 2.3 1c1.1 0 1.1-1 2.3-1 1.1 0 1.1 1 2.3 1 1.1 0 1.1-1 2.3-1 1.1 0 1.1 1 2.3 1 1.1 0 1.1-1 2.3-1",
      },
    ],
  ],
};

/**
 * Creates the spell-check-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SpellCheck2(options) {
  return createIcon(definition, options);
}

export default SpellCheck2;
