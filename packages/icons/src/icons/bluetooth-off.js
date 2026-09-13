import { createIcon } from "../icon.js";

const definition = {
  name: "bluetooth-off",
  nodes: [
    [
      "path",
      {
        d: "m17 17-5 5V12l-5 5",
      },
    ],
    [
      "path",
      {
        d: "m2 2 20 20",
      },
    ],
    [
      "path",
      {
        d: "M14.5 9.5 17 7l-5-5v4.5",
      },
    ],
  ],
};

/**
 * Creates the bluetooth-off icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BluetoothOff(options) {
  return createIcon(definition, options);
}

export default BluetoothOff;
