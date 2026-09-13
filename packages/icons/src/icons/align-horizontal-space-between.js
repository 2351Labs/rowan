import { createIcon } from "../icon.js";

const definition = {
  name: "align-horizontal-space-between",
  nodes: [
    [
      "rect",
      {
        width: "6",
        height: "14",
        x: "3",
        y: "5",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        width: "6",
        height: "10",
        x: "15",
        y: "7",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M3 2v20",
      },
    ],
    [
      "path",
      {
        d: "M21 2v20",
      },
    ],
  ],
};

/**
 * Creates the align-horizontal-space-between icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AlignHorizontalSpaceBetween(options) {
  return createIcon(definition, options);
}

export default AlignHorizontalSpaceBetween;
