import { createIcon } from "../icon.js";

const definition = {
  name: "radio-receiver",
  nodes: [
    [
      "path",
      {
        d: "M5 16v2",
      },
    ],
    [
      "path",
      {
        d: "M19 16v2",
      },
    ],
    [
      "rect",
      {
        width: "20",
        height: "8",
        x: "2",
        y: "8",
        rx: "2",
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
 * Creates the radio-receiver icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function RadioReceiver(options) {
  return createIcon(definition, options);
}

export default RadioReceiver;
