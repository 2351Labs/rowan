import { createIcon } from "../icon.js";

const definition = {
  name: "circle-arrow-out-up-left",
  nodes: [
    [
      "path",
      {
        d: "M2 8V2h6",
      },
    ],
    [
      "path",
      {
        d: "m2 2 10 10",
      },
    ],
    [
      "path",
      {
        d: "M12 2A10 10 0 1 1 2 12",
      },
    ],
  ],
};

/**
 * Creates the circle-arrow-out-up-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleArrowOutUpLeft(options) {
  return createIcon(definition, options);
}

export default CircleArrowOutUpLeft;
