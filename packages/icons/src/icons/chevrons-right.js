import { createIcon } from "../icon.js";

const definition = {
  name: "chevrons-right",
  nodes: [
    [
      "path",
      {
        d: "m6 17 5-5-5-5",
      },
    ],
    [
      "path",
      {
        d: "m13 17 5-5-5-5",
      },
    ],
  ],
};

/**
 * Creates the chevrons-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChevronsRight(options) {
  return createIcon(definition, options);
}

export default ChevronsRight;
