import { createIcon } from "../icon.js";

const definition = {
  name: "chevrons-left",
  nodes: [
    [
      "path",
      {
        d: "m11 17-5-5 5-5",
      },
    ],
    [
      "path",
      {
        d: "m18 17-5-5 5-5",
      },
    ],
  ],
};

/**
 * Creates the chevrons-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChevronsLeft(options) {
  return createIcon(definition, options);
}

export default ChevronsLeft;
