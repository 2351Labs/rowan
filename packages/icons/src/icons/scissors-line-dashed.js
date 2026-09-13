import { createIcon } from "../icon.js";

const definition = {
  name: "scissors-line-dashed",
  nodes: [
    [
      "path",
      {
        d: "M5.42 9.42 8 12",
      },
    ],
    [
      "circle",
      {
        cx: "4",
        cy: "8",
        r: "2",
      },
    ],
    [
      "path",
      {
        d: "m14 6-8.58 8.58",
      },
    ],
    [
      "circle",
      {
        cx: "4",
        cy: "16",
        r: "2",
      },
    ],
    [
      "path",
      {
        d: "M10.8 14.8 14 18",
      },
    ],
    [
      "path",
      {
        d: "M16 12h-2",
      },
    ],
    [
      "path",
      {
        d: "M22 12h-2",
      },
    ],
  ],
};

/**
 * Creates the scissors-line-dashed icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ScissorsLineDashed(options) {
  return createIcon(definition, options);
}

export default ScissorsLineDashed;
