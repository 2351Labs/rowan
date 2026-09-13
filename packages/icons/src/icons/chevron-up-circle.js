import { createIcon } from "../icon.js";

const definition = {
  name: "chevron-up-circle",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
    [
      "path",
      {
        d: "m8 14 4-4 4 4",
      },
    ],
  ],
};

/**
 * Creates the chevron-up-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChevronUpCircle(options) {
  return createIcon(definition, options);
}

export default ChevronUpCircle;
