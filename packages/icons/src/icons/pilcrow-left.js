import { createIcon } from "../icon.js";

const definition = {
  name: "pilcrow-left",
  nodes: [
    [
      "path",
      {
        d: "M14 3v11",
      },
    ],
    [
      "path",
      {
        d: "M14 9h-3a3 3 0 0 1 0-6h9",
      },
    ],
    [
      "path",
      {
        d: "M18 3v11",
      },
    ],
    [
      "path",
      {
        d: "M22 18H2l4-4",
      },
    ],
    [
      "path",
      {
        d: "m6 22-4-4",
      },
    ],
  ],
};

/**
 * Creates the pilcrow-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PilcrowLeft(options) {
  return createIcon(definition, options);
}

export default PilcrowLeft;
