import { createIcon } from "../icon.js";

const definition = {
  name: "fuel",
  nodes: [
    [
      "path",
      {
        d: "M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0v-6.998a2 2 0 0 0-.59-1.42L18 5",
      },
    ],
    [
      "path",
      {
        d: "M14 21V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16",
      },
    ],
    [
      "path",
      {
        d: "M2 21h13",
      },
    ],
    [
      "path",
      {
        d: "M3 9h11",
      },
    ],
  ],
};

/**
 * Creates the fuel icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Fuel(options) {
  return createIcon(definition, options);
}

export default Fuel;
