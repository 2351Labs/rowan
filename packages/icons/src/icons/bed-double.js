import { createIcon } from "../icon.js";

const definition = {
  name: "bed-double",
  nodes: [
    [
      "path",
      {
        d: "M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8",
      },
    ],
    [
      "path",
      {
        d: "M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4",
      },
    ],
    [
      "path",
      {
        d: "M12 4v6",
      },
    ],
    [
      "path",
      {
        d: "M2 18h20",
      },
    ],
  ],
};

/**
 * Creates the bed-double icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BedDouble(options) {
  return createIcon(definition, options);
}

export default BedDouble;
