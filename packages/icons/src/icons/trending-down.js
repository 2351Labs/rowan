import { createIcon } from "../icon.js";

const definition = {
  name: "trending-down",
  nodes: [
    [
      "path",
      {
        d: "M16 17h6v-6",
      },
    ],
    [
      "path",
      {
        d: "m22 17-8.5-8.5-5 5L2 7",
      },
    ],
  ],
};

/**
 * Creates the trending-down icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TrendingDown(options) {
  return createIcon(definition, options);
}

export default TrendingDown;
