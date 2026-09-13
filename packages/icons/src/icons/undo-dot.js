import { createIcon } from "../icon.js";

const definition = {
  name: "undo-dot",
  nodes: [
    [
      "path",
      {
        d: "M21 17a9 9 0 0 0-15-6.7L3 13",
      },
    ],
    [
      "path",
      {
        d: "M3 7v6h6",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "17",
        r: "1",
      },
    ],
  ],
};

/**
 * Creates the undo-dot icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function UndoDot(options) {
  return createIcon(definition, options);
}

export default UndoDot;
