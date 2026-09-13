import { createIcon } from "../icon.js";

const definition = {
  name: "bed",
  nodes: [
    [
      "path",
      {
        d: "M2 4v16",
      },
    ],
    [
      "path",
      {
        d: "M2 8h18a2 2 0 0 1 2 2v10",
      },
    ],
    [
      "path",
      {
        d: "M2 17h20",
      },
    ],
    [
      "path",
      {
        d: "M6 8v9",
      },
    ],
  ],
};

/**
 * Creates the bed icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Bed(options) {
  return createIcon(definition, options);
}

export default Bed;
