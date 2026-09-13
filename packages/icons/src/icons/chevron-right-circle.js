import { createIcon } from "../icon.js";

const definition = {
  name: "chevron-right-circle",
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
        d: "m10 8 4 4-4 4",
      },
    ],
  ],
};

/**
 * Creates the chevron-right-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChevronRightCircle(options) {
  return createIcon(definition, options);
}

export default ChevronRightCircle;
