import { createIcon } from "../icon.js";

const definition = {
  name: "smartphone-nfc",
  nodes: [
    [
      "rect",
      {
        width: "7",
        height: "12",
        x: "2",
        y: "6",
        rx: "1",
      },
    ],
    [
      "path",
      {
        d: "M13 8.32a7.43 7.43 0 0 1 0 7.36",
      },
    ],
    [
      "path",
      {
        d: "M16.46 6.21a11.76 11.76 0 0 1 0 11.58",
      },
    ],
    [
      "path",
      {
        d: "M19.91 4.1a15.91 15.91 0 0 1 .01 15.8",
      },
    ],
  ],
};

/**
 * Creates the smartphone-nfc icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SmartphoneNfc(options) {
  return createIcon(definition, options);
}

export default SmartphoneNfc;
