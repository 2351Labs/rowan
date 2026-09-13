import { createIcon } from "../icon.js";

const definition = {
  name: "wallet-cards",
  nodes: [
    [
      "path",
      {
        d: "M3 11h3.75a2 2 0 0 1 1.6.8l.45.6a4 4 0 0 0 6.4 0l.45-.6a2 2 0 0 1 1.6-.8H21",
      },
    ],
    [
      "path",
      {
        d: "M3 7h18",
      },
    ],
    [
      "rect",
      {
        x: "3",
        y: "3",
        width: "18",
        height: "18",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the wallet-cards icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function WalletCards(options) {
  return createIcon(definition, options);
}

export default WalletCards;
