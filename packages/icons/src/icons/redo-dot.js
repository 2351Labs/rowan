import { createIcon } from "../icon.js";

const definition = {
  name: "redo-dot",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "17",
        r: "1",
      },
    ],
    [
      "path",
      {
        d: "M21 7v6h-6",
      },
    ],
    [
      "path",
      {
        d: "M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7",
      },
    ],
  ],
};

/**
 * Creates the redo-dot icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function RedoDot(options) {
  return createIcon(definition, options);
}

export default RedoDot;
