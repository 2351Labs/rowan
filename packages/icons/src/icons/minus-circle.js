import { createIcon } from "../icon.js";

const definition = {
  name: "minus-circle",
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
        d: "M8 12h8",
      },
    ],
  ],
};

/**
 * Creates the minus-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MinusCircle(options) {
  return createIcon(definition, options);
}

export default MinusCircle;
