import { createIcon } from "../icon.js";

const definition = {
  name: "wallet",
  nodes: [
    [
      "path",
      {
        d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
      },
    ],
    [
      "path",
      {
        d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",
      },
    ],
  ],
};

/**
 * Creates the wallet icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Wallet(options) {
  return createIcon(definition, options);
}

export default Wallet;
