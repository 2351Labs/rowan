import { createIcon } from "../icon.js";

const definition = {
  name: "credit-card-plus",
  nodes: [
    [
      "path",
      {
        d: "M22 11.354V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h8.536",
      },
    ],
    [
      "path",
      {
        d: "M22 10H2",
      },
    ],
    [
      "path",
      {
        d: "M6 14h2",
      },
    ],
    [
      "path",
      {
        d: "M16 17h6",
      },
    ],
    [
      "path",
      {
        d: "M19 14v6",
      },
    ],
  ],
};

/**
 * Creates the credit-card-plus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CreditCardPlus(options) {
  return createIcon(definition, options);
}

export default CreditCardPlus;
