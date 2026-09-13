import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-left-circle",
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
        d: "m12 8-4 4 4 4",
      },
    ],
    [
      "path",
      {
        d: "M16 12H8",
      },
    ],
  ],
};

/**
 * Creates the arrow-left-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowLeftCircle(options) {
  return createIcon(definition, options);
}

export default ArrowLeftCircle;
