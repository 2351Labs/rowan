import { createIcon } from "../icon.js";

const definition = {
  name: "chevron-first",
  nodes: [
    [
      "path",
      {
        d: "m17 18-6-6 6-6",
      },
    ],
    [
      "path",
      {
        d: "M7 6v12",
      },
    ],
  ],
};

/**
 * Creates the chevron-first icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChevronFirst(options) {
  return createIcon(definition, options);
}

export default ChevronFirst;
