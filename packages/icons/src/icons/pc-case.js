import { createIcon } from "../icon.js";

const definition = {
  name: "pc-case",
  nodes: [
    [
      "rect",
      {
        width: "14",
        height: "20",
        x: "5",
        y: "2",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M15 14h.01",
      },
    ],
    [
      "path",
      {
        d: "M9 6h6",
      },
    ],
    [
      "path",
      {
        d: "M9 10h6",
      },
    ],
  ],
};

/**
 * Creates the pc-case icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PcCase(options) {
  return createIcon(definition, options);
}

export default PcCase;
