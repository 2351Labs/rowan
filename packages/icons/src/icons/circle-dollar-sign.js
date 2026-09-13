import { createIcon } from "../icon.js";

const definition = {
  name: "circle-dollar-sign",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
    [
      "path",
      {
        d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",
      },
    ],
    [
      "path",
      {
        d: "M12 18V6",
      },
    ],
  ],
};

/**
 * Creates the circle-dollar-sign icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleDollarSign(options) {
  return createIcon(definition, options);
}

export default CircleDollarSign;
