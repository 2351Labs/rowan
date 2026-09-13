import { createIcon } from "../icon.js";

const definition = {
  name: "usb-c-port",
  nodes: [
    [
      "path",
      {
        d: "M6 12h12",
      },
    ],
    [
      "rect",
      {
        x: "2",
        y: "8",
        width: "20",
        height: "8",
        rx: "4",
      },
    ],
  ],
};

/**
 * Creates the usb-c-port icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function UsbCPort(options) {
  return createIcon(definition, options);
}

export default UsbCPort;
