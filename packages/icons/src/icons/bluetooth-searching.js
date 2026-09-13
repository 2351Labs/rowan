import { createIcon } from "../icon.js";

const definition = {
  name: "bluetooth-searching",
  nodes: [
    [
      "path",
      {
        d: "m7 7 10 10-5 5V2l5 5L7 17",
      },
    ],
    [
      "path",
      {
        d: "M20.83 14.83a4 4 0 0 0 0-5.66",
      },
    ],
    [
      "path",
      {
        d: "M18 12h.01",
      },
    ],
  ],
};

/**
 * Creates the bluetooth-searching icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BluetoothSearching(options) {
  return createIcon(definition, options);
}

export default BluetoothSearching;
