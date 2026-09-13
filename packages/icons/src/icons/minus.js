import { createIcon } from "../icon.js";

const definition = {
  name: "minus",
  nodes: [
    [
      "path",
      {
        d: "M5 12h14",
      },
    ],
  ],
};

/**
 * Creates the minus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Minus(options) {
  return createIcon(definition, options);
}

export default Minus;
