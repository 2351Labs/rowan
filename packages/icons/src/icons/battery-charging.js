import { createIcon } from "../icon.js";

const definition = {
  name: "battery-charging",
  nodes: [
    [
      "path",
      {
        d: "m11 7-3 5h4l-3 5",
      },
    ],
    [
      "path",
      {
        d: "M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935",
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
        d: "M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936",
      },
    ],
  ],
};

/**
 * Creates the battery-charging icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BatteryCharging(options) {
  return createIcon(definition, options);
}

export default BatteryCharging;
