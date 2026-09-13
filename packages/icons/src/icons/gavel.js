import { createIcon } from "../icon.js";

const definition = {
  name: "gavel",
  nodes: [
    [
      "path",
      {
        d: "m14 13-8.381 8.38a1 1 0 0 1-3.001-3l8.384-8.381",
      },
    ],
    [
      "path",
      {
        d: "m16 16 6-6",
      },
    ],
    [
      "path",
      {
        d: "m21.5 10.5-8-8",
      },
    ],
    [
      "path",
      {
        d: "m8 8 6-6",
      },
    ],
    [
      "path",
      {
        d: "m8.5 7.5 8 8",
      },
    ],
  ],
};

/**
 * Creates the gavel icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Gavel(options) {
  return createIcon(definition, options);
}

export default Gavel;
