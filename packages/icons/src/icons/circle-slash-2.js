import { createIcon } from "../icon.js";

const definition = {
  name: "circle-slash-2",
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
        d: "M22 2 2 22",
      },
    ],
  ],
};

/**
 * Creates the circle-slash-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CircleSlash2(options) {
  return createIcon(definition, options);
}

export default CircleSlash2;
