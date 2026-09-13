import { createIcon } from "../icon.js";

const definition = {
  name: "battery-full",
  nodes: [
    [
      "path",
      {
        d: "M10 10v4",
      },
    ],
    [
      "path",
      {
        d: "M14 10v4",
      },
    ],
    [
      "path",
      {
        d: "M22 14v-4",
      },
    ],
    [
      "path",
      {
        d: "M6 10v4",
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
 * Creates the battery-full icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BatteryFull(options) {
  return createIcon(definition, options);
}

export default BatteryFull;
