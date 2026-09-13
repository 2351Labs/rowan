import { createIcon } from "../icon.js";

const definition = {
  name: "align-vertical-justify-end",
  nodes: [
    [
      "rect",
      {
        width: "14",
        height: "6",
        x: "5",
        y: "12",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        width: "10",
        height: "6",
        x: "7",
        y: "2",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M2 22h20",
      },
    ],
  ],
};

/**
 * Creates the align-vertical-justify-end icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AlignVerticalJustifyEnd(options) {
  return createIcon(definition, options);
}

export default AlignVerticalJustifyEnd;
