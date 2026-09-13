import { createIcon } from "../icon.js";

const definition = {
  name: "chevron-right",
  nodes: [
    [
      "path",
      {
        d: "m9 18 6-6-6-6",
      },
    ],
  ],
};

/**
 * Creates the chevron-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChevronRight(options) {
  return createIcon(definition, options);
}

export default ChevronRight;
