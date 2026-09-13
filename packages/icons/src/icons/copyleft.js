import { createIcon } from "../icon.js";

const definition = {
  name: "copyleft",
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
        d: "M9.17 14.83a4 4 0 1 0 0-5.66",
      },
    ],
  ],
};

/**
 * Creates the copyleft icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Copyleft(options) {
  return createIcon(definition, options);
}

export default Copyleft;
