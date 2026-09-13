import { createIcon } from "../icon.js";

const definition = {
  name: "chevron-left-circle",
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
        d: "m14 16-4-4 4-4",
      },
    ],
  ],
};

/**
 * Creates the chevron-left-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChevronLeftCircle(options) {
  return createIcon(definition, options);
}

export default ChevronLeftCircle;
