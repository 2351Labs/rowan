import { createIcon } from "../icon.js";

const definition = {
  name: "square-off",
  nodes: [
    [
      "path",
      {
        d: "M20.4 20.4a2 2 0 01-1.4.6H5a2 2 0 01-2-2V5a2 2 0 01.59-1.41",
      },
    ],
    [
      "path",
      {
        d: "M21 15.3V5a2 2 0 00-2-2H8.7",
      },
    ],
    [
      "path",
      {
        d: "M22 22 2 2",
      },
    ],
  ],
};

/**
 * Creates the square-off icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareOff(options) {
  return createIcon(definition, options);
}

export default SquareOff;
