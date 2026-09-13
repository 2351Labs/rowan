import { createIcon } from "../icon.js";

const definition = {
  name: "chevrons-right-left",
  nodes: [
    [
      "path",
      {
        d: "m20 17-5-5 5-5",
      },
    ],
    [
      "path",
      {
        d: "m4 17 5-5-5-5",
      },
    ],
  ],
};

/**
 * Creates the chevrons-right-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChevronsRightLeft(options) {
  return createIcon(definition, options);
}

export default ChevronsRightLeft;
