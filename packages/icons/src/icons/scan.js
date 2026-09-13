import { createIcon } from "../icon.js";

const definition = {
  name: "scan",
  nodes: [
    [
      "path",
      {
        d: "M3 7V5a2 2 0 0 1 2-2h2",
      },
    ],
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
        d: "M7 21H5a2 2 0 0 1-2-2v-2",
      },
    ],
  ],
};

/**
 * Creates the scan icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Scan(options) {
  return createIcon(definition, options);
}

export default Scan;
