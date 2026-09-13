import { createIcon } from "../icon.js";

const definition = {
  name: "wifi-zero",
  nodes: [
    [
      "path",
      {
        d: "M12 20h.01",
      },
    ],
  ],
};

/**
 * Creates the wifi-zero icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function WifiZero(options) {
  return createIcon(definition, options);
}

export default WifiZero;
