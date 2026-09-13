import { createIcon } from "../icon.js";

const definition = {
  name: "chevron-down-circle",
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
        d: "m16 10-4 4-4-4",
      },
    ],
  ],
};

/**
 * Creates the chevron-down-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChevronDownCircle(options) {
  return createIcon(definition, options);
}

export default ChevronDownCircle;
