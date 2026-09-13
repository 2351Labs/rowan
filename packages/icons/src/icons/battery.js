import { createIcon } from "../icon.js";

const definition = {
  name: "battery",
  nodes: [
    [
      "path",
      {
        d: "M 22 14 L 22 10",
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
 * Creates the battery icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Battery(options) {
  return createIcon(definition, options);
}

export default Battery;
