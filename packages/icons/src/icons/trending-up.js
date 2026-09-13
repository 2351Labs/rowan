import { createIcon } from "../icon.js";

const definition = {
  name: "trending-up",
  nodes: [
    [
      "path",
      {
        d: "M16 7h6v6",
      },
    ],
    [
      "path",
      {
        d: "m22 7-8.5 8.5-5-5L2 17",
      },
    ],
  ],
};

/**
 * Creates the trending-up icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TrendingUp(options) {
  return createIcon(definition, options);
}

export default TrendingUp;
