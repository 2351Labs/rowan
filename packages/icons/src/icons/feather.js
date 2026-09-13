import { createIcon } from "../icon.js";

const definition = {
  name: "feather",
  nodes: [
    [
      "path",
      {
        d: "M14.086 18.412A2 2 0 0112.67 19H5v-7.672a2 2 0 01.586-1.414L11.75 3.75a6 6 0 118.49 8.49z",
      },
    ],
    [
      "path",
      {
        d: "M16 8 2 22",
      },
    ],
    [
      "path",
      {
        d: "M17.488 15H9",
      },
    ],
  ],
};

/**
 * Creates the feather icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Feather(options) {
  return createIcon(definition, options);
}

export default Feather;
