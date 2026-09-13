import { createIcon } from "../icon.js";

const definition = {
  name: "shopping-cart-minus",
  nodes: [
    [
      "path",
      {
        d: "M16 5h6",
      },
    ],
    [
      "path",
      {
        d: "m2.05 2.05 1.099-.028a1 1 0 011.008.815l2.69 14.347A1 1 0 007.83 18H18",
      },
    ],
    [
      "path",
      {
        d: "M4.564 5H12",
      },
    ],
    [
      "path",
      {
        d: "M6.25 14h12.712a2 2 0 001.991-1.57l.514-3.113",
      },
    ],
    [
      "circle",
      {
        cx: "18",
        cy: "20",
        r: "2",
      },
    ],
    [
      "circle",
      {
        cx: "8",
        cy: "20",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the shopping-cart-minus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ShoppingCartMinus(options) {
  return createIcon(definition, options);
}

export default ShoppingCartMinus;
