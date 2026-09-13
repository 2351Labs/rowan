import { createIcon } from "../icon.js";

const definition = {
  name: "battery-plus",
  nodes: [
    [
      "path",
      {
        d: "M10 9v6",
      },
    ],
    [
      "path",
      {
        d: "M12.543 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.605",
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
        d: "M7 12h6",
      },
    ],
    [
      "path",
      {
        d: "M7.606 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.606",
      },
    ],
  ],
};

/**
 * Creates the battery-plus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BatteryPlus(options) {
  return createIcon(definition, options);
}

export default BatteryPlus;
