import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-up-z-a",
  nodes: [
    [
      "path",
      {
        d: "m3 8 4-4 4 4",
      },
    ],
    [
      "path",
      {
        d: "M7 4v16",
      },
    ],
    [
      "path",
      {
        d: "M15 4h5l-5 6h5",
      },
    ],
    [
      "path",
      {
        d: "M15 20v-3.5a2.5 2.5 0 0 1 5 0V20",
      },
    ],
    [
      "path",
      {
        d: "M20 18h-5",
      },
    ],
  ],
};

/**
 * Creates the arrow-up-z-a icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowUpZA(options) {
  return createIcon(definition, options);
}

export default ArrowUpZA;
