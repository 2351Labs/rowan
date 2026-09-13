import { createIcon } from "../icon.js";

const definition = {
  name: "align-vertical-justify-start",
  nodes: [
    [
      "rect",
      {
        width: "14",
        height: "6",
        x: "5",
        y: "16",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        width: "10",
        height: "6",
        x: "7",
        y: "6",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M2 2h20",
      },
    ],
  ],
};

/**
 * Creates the align-vertical-justify-start icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AlignVerticalJustifyStart(options) {
  return createIcon(definition, options);
}

export default AlignVerticalJustifyStart;
