import { createIcon } from "../icon.js";

const definition = {
  name: "chevron-left",
  nodes: [
    [
      "path",
      {
        d: "m15 18-6-6 6-6",
      },
    ],
  ],
};

/**
 * Creates the chevron-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChevronLeft(options) {
  return createIcon(definition, options);
}

export default ChevronLeft;
