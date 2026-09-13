import { createIcon } from "../icon.js";

const definition = {
  name: "filter",
  nodes: [
    [
      "path",
      {
        d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      },
    ],
  ],
};

/**
 * Creates the filter icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Filter(options) {
  return createIcon(definition, options);
}

export default Filter;
