import { createIcon } from "../icon.js";

const definition = {
  name: "parentheses",
  nodes: [
    [
      "path",
      {
        d: "M8 21s-4-3-4-9 4-9 4-9",
      },
    ],
    [
      "path",
      {
        d: "M16 3s4 3 4 9-4 9-4 9",
      },
    ],
  ],
};

/**
 * Creates the parentheses icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Parentheses(options) {
  return createIcon(definition, options);
}

export default Parentheses;
