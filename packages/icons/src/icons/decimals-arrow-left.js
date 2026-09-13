import { createIcon } from "../icon.js";

const definition = {
  name: "decimals-arrow-left",
  nodes: [
    [
      "path",
      {
        d: "m13 21-3-3 3-3",
      },
    ],
    [
      "path",
      {
        d: "M20 18H10",
      },
    ],
    [
      "path",
      {
        d: "M3 11h.01",
      },
    ],
    [
      "rect",
      {
        x: "6",
        y: "3",
        width: "5",
        height: "8",
        rx: "2.5",
      },
    ],
  ],
};

/**
 * Creates the decimals-arrow-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function DecimalsArrowLeft(options) {
  return createIcon(definition, options);
}

export default DecimalsArrowLeft;
