import { createIcon } from "../icon.js";

const definition = {
  name: "align-vertical-space-between",
  nodes: [
    [
      "rect",
      {
        width: "14",
        height: "6",
        x: "5",
        y: "15",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        width: "10",
        height: "6",
        x: "7",
        y: "3",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M2 21h20",
      },
    ],
    [
      "path",
      {
        d: "M2 3h20",
      },
    ],
  ],
};

/**
 * Creates the align-vertical-space-between icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AlignVerticalSpaceBetween(options) {
  return createIcon(definition, options);
}

export default AlignVerticalSpaceBetween;
