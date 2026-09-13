import { createIcon } from "../icon.js";

const definition = {
  name: "circle",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
  ],
};

/**
 * Creates the circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Circle(options) {
  return createIcon(definition, options);
}

export default Circle;
