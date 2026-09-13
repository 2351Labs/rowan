import { createIcon } from "../icon.js";

const definition = {
  name: "utensils-crossed",
  nodes: [
    [
      "path",
      {
        d: "m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8",
      },
    ],
    [
      "path",
      {
        d: "M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7",
      },
    ],
    [
      "path",
      {
        d: "m2.1 21.8 6.4-6.3",
      },
    ],
    [
      "path",
      {
        d: "m19 5-7 7",
      },
    ],
  ],
};

/**
 * Creates the utensils-crossed icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function UtensilsCrossed(options) {
  return createIcon(definition, options);
}

export default UtensilsCrossed;
