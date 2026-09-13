import { createIcon } from "../icon.js";

const definition = {
  name: "chevrons-left-right",
  nodes: [
    [
      "path",
      {
        d: "m9 7-5 5 5 5",
      },
    ],
    [
      "path",
      {
        d: "m15 7 5 5-5 5",
      },
    ],
  ],
};

/**
 * Creates the chevrons-left-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChevronsLeftRight(options) {
  return createIcon(definition, options);
}

export default ChevronsLeftRight;
