import { createIcon } from "../icon.js";

const definition = {
  name: "circle-arrow-up",
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
        d: "m16 12-4-4-4 4",
      },
    ],
    [
      "path",
      {
        d: "M12 16V8",
      },
    ],
  ],
};

/**
 * Creates the circle-arrow-up icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleArrowUp(options) {
  return createIcon(definition, options);
}

export default CircleArrowUp;
