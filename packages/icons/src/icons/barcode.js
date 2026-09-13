import { createIcon } from "../icon.js";

const definition = {
  name: "barcode",
  nodes: [
    [
      "path",
      {
        d: "M3 5v14",
      },
    ],
    [
      "path",
      {
        d: "M8 5v14",
      },
    ],
    [
      "path",
      {
        d: "M12 5v14",
      },
    ],
    [
      "path",
      {
        d: "M17 5v14",
      },
    ],
    [
      "path",
      {
        d: "M21 5v14",
      },
    ],
  ],
};

/**
 * Creates the barcode icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Barcode(options) {
  return createIcon(definition, options);
}

export default Barcode;
