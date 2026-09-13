import { createIcon } from "../icon.js";

const definition = {
  name: "pill-bottle",
  nodes: [
    [
      "path",
      {
        d: "M18 11h-4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4",
      },
    ],
    [
      "path",
      {
        d: "M6 7v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7",
      },
    ],
    [
      "rect",
      {
        width: "16",
        height: "5",
        x: "4",
        y: "2",
        rx: "1",
      },
    ],
  ],
};

/**
 * Creates the pill-bottle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PillBottle(options) {
  return createIcon(definition, options);
}

export default PillBottle;
