import { createIcon } from "../icon.js";

const definition = {
  name: "circle-arrow-out-down-left",
  nodes: [
    [
      "path",
      {
        d: "M2 12a10 10 0 1 1 10 10",
      },
    ],
    [
      "path",
      {
        d: "m2 22 10-10",
      },
    ],
    [
      "path",
      {
        d: "M8 22H2v-6",
      },
    ],
  ],
};

/**
 * Creates the circle-arrow-out-down-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleArrowOutDownLeft(options) {
  return createIcon(definition, options);
}

export default CircleArrowOutDownLeft;
