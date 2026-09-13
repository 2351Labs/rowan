import { createIcon } from "../icon.js";

const definition = {
  name: "battery-low",
  nodes: [
    [
      "path",
      {
        d: "M22 14v-4",
      },
    ],
    [
      "path",
      {
        d: "M6 14v-4",
      },
    ],
    [
      "rect",
      {
        x: "2",
        y: "6",
        width: "16",
        height: "12",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the battery-low icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BatteryLow(options) {
  return createIcon(definition, options);
}

export default BatteryLow;
