import { createIcon } from "../icon.js";

const definition = {
  name: "russian-ruble",
  nodes: [
    [
      "path",
      {
        d: "M6 11h8a4 4 0 0 0 0-8H9v18",
      },
    ],
    [
      "path",
      {
        d: "M6 15h8",
      },
    ],
  ],
};

/**
 * Creates the russian-ruble icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function RussianRuble(options) {
  return createIcon(definition, options);
}

export default RussianRuble;
