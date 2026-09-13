import { createIcon } from "../icon.js";

const definition = {
  name: "scan-heart",
  nodes: [
    [
      "path",
      {
        d: "M17 3h2a2 2 0 0 1 2 2v2",
      },
    ],
    [
      "path",
      {
        d: "M21 17v2a2 2 0 0 1-2 2h-2",
      },
    ],
    [
      "path",
      {
        d: "M3 7V5a2 2 0 0 1 2-2h2",
      },
    ],
    [
      "path",
      {
        d: "M7 21H5a2 2 0 0 1-2-2v-2",
      },
    ],
    [
      "path",
      {
        d: "M7.828 13.07A3 3 0 0 1 12 8.764a3 3 0 0 1 4.172 4.306l-3.447 3.62a1 1 0 0 1-1.449 0z",
      },
    ],
  ],
};

/**
 * Creates the scan-heart icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ScanHeart(options) {
  return createIcon(definition, options);
}

export default ScanHeart;
