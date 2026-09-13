import { createIcon } from "../icon.js";

const definition = {
  name: "wifi-low",
  nodes: [
    [
      "path",
      {
        d: "M12 20h.01",
      },
    ],
    [
      "path",
      {
        d: "M8.5 16.429a5 5 0 0 1 7 0",
      },
    ],
  ],
};

/**
 * Creates the wifi-low icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function WifiLow(options) {
  return createIcon(definition, options);
}

export default WifiLow;
