import { createIcon } from "../icon.js";

const definition = {
  name: "dessert",
  nodes: [
    [
      "path",
      {
        d: "M10.162 3.167A10 10 0 0 0 2 13a2 2 0 0 0 4 0v-1a2 2 0 0 1 4 0v4a2 2 0 0 0 4 0v-4a2 2 0 0 1 4 0v1a2 2 0 0 0 4-.006 10 10 0 0 0-8.161-9.826",
      },
    ],
    [
      "path",
      {
        d: "M20.804 14.869a9 9 0 0 1-17.608 0",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "4",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the dessert icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Dessert(options) {
  return createIcon(definition, options);
}

export default Dessert;
