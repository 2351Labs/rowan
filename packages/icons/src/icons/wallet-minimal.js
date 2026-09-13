import { createIcon } from "../icon.js";

const definition = {
  name: "wallet-minimal",
  nodes: [
    [
      "path",
      {
        d: "M17 14h.01",
      },
    ],
    [
      "path",
      {
        d: "M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14",
      },
    ],
  ],
};

/**
 * Creates the wallet-minimal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function WalletMinimal(options) {
  return createIcon(definition, options);
}

export default WalletMinimal;
