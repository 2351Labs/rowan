import { createIcon } from "../icon.js";

const definition = {
  name: "circle-arrow-down",
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
        d: "M12 8v8",
      },
    ],
    [
      "path",
      {
        d: "m8 12 4 4 4-4",
      },
    ],
  ],
};

/**
 * Creates the circle-arrow-down icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleArrowDown(options) {
  return createIcon(definition, options);
}

export default CircleArrowDown;
