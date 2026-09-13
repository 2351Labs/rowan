import { createIcon } from "../icon.js";

const definition = {
  name: "square-check-big",
  nodes: [
    [
      "path",
      {
        d: "M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344",
      },
    ],
    [
      "path",
      {
        d: "m9 11 3 3L22 4",
      },
    ],
  ],
};

/**
 * Creates the square-check-big icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareCheckBig(options) {
  return createIcon(definition, options);
}

export default SquareCheckBig;
