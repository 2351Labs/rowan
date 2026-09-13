import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-up-az",
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
        d: "M20 8h-5",
      },
    ],
    [
      "path",
      {
        d: "M15 10V6.5a2.5 2.5 0 0 1 5 0V10",
      },
    ],
    [
      "path",
      {
        d: "M15 14h5l-5 6h5",
      },
    ],
  ],
};

/**
 * Creates the arrow-up-az icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowUpAz(options) {
  return createIcon(definition, options);
}

export default ArrowUpAz;
