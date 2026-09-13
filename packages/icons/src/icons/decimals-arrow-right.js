import { createIcon } from "../icon.js";

const definition = {
  name: "decimals-arrow-right",
  nodes: [
    [
      "path",
      {
        d: "M10 18h10",
      },
    ],
    [
      "path",
      {
        d: "m17 21 3-3-3-3",
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
        x: "15",
        y: "3",
        width: "5",
        height: "8",
        rx: "2.5",
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
 * Creates the decimals-arrow-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function DecimalsArrowRight(options) {
  return createIcon(definition, options);
}

export default DecimalsArrowRight;
