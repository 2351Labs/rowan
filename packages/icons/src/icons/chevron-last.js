import { createIcon } from "../icon.js";

const definition = {
  name: "chevron-last",
  nodes: [
    [
      "path",
      {
        d: "m7 18 6-6-6-6",
      },
    ],
    [
      "path",
      {
        d: "M17 6v12",
      },
    ],
  ],
};

/**
 * Creates the chevron-last icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChevronLast(options) {
  return createIcon(definition, options);
}

export default ChevronLast;
