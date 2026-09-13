import { createIcon } from "../icon.js";

const definition = {
  name: "dot",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "1",
      },
    ],
  ],
};

/**
 * Creates the dot icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Dot(options) {
  return createIcon(definition, options);
}

export default Dot;
