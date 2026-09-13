import { createIcon } from "../icon.js";

const definition = {
  name: "credit-card-minus",
  nodes: [
    [
      "path",
      {
        d: "M22 13V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h8.536",
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
  ],
};

/**
 * Creates the credit-card-minus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CreditCardMinus(options) {
  return createIcon(definition, options);
}

export default CreditCardMinus;
