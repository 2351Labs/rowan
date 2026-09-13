import { createIcon } from "../icon.js";

const definition = {
  name: "bluetooth",
  nodes: [
    [
      "path",
      {
        d: "m7 7 10 10-5 5V2l5 5L7 17",
      },
    ],
  ],
};

/**
 * Creates the bluetooth icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Bluetooth(options) {
  return createIcon(definition, options);
}

export default Bluetooth;
