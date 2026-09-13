import { createIcon } from "../icon.js";

const definition = {
  name: "slice",
  nodes: [
    [
      "path",
      {
        d: "M11 16.586V19a1 1 0 0 1-1 1H2L18.37 3.63a1 1 0 1 1 3 3l-9.663 9.663a1 1 0 0 1-1.414 0L8 14",
      },
    ],
  ],
};

/**
 * Creates the slice icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Slice(options) {
  return createIcon(definition, options);
}

export default Slice;
