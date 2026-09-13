import { createIcon } from "../icon.js";

const definition = {
  name: "circle-chevron-up",
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
        d: "m8 14 4-4 4 4",
      },
    ],
  ],
};

/**
 * Creates the circle-chevron-up icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleChevronUp(options) {
  return createIcon(definition, options);
}

export default CircleChevronUp;
