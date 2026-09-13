import { createIcon } from "../icon.js";

const definition = {
  name: "smartphone-charging",
  nodes: [
    [
      "rect",
      {
        width: "14",
        height: "20",
        x: "5",
        y: "2",
        rx: "2",
        ry: "2",
      },
    ],
    [
      "path",
      {
        d: "M12.667 8 10 12h4l-2.667 4",
      },
    ],
  ],
};

/**
 * Creates the smartphone-charging icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SmartphoneCharging(options) {
  return createIcon(definition, options);
}

export default SmartphoneCharging;
