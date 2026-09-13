import { createIcon } from "../icon.js";

const definition = {
  name: "credit-card",
  nodes: [
    [
      "rect",
      {
        width: "20",
        height: "14",
        x: "2",
        y: "5",
        rx: "2",
      },
    ],
    [
      "line",
      {
        x1: "2",
        x2: "22",
        y1: "10",
        y2: "10",
      },
    ],
    [
      "path",
      {
        d: "M6 14h2",
      },
    ],
  ],
};

/**
 * Creates the credit-card icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CreditCard(options) {
  return createIcon(definition, options);
}

export default CreditCard;
