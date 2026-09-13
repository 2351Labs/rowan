import { createIcon } from "../icon.js";

const definition = {
  name: "circle-arrow-out-down-right",
  nodes: [
    [
      "path",
      {
        d: "M12 22a10 10 0 1 1 10-10",
      },
    ],
    [
      "path",
      {
        d: "M22 22 12 12",
      },
    ],
    [
      "path",
      {
        d: "M22 16v6h-6",
      },
    ],
  ],
};

/**
 * Creates the circle-arrow-out-down-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleArrowOutDownRight(options) {
  return createIcon(definition, options);
}

export default CircleArrowOutDownRight;
