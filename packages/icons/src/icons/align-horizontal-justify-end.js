import { createIcon } from "../icon.js";

const definition = {
  name: "align-horizontal-justify-end",
  nodes: [
    [
      "rect",
      {
        width: "6",
        height: "14",
        x: "2",
        y: "5",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        width: "6",
        height: "10",
        x: "12",
        y: "7",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M22 2v20",
      },
    ],
  ],
};

/**
 * Creates the align-horizontal-justify-end icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AlignHorizontalJustifyEnd(options) {
  return createIcon(definition, options);
}

export default AlignHorizontalJustifyEnd;
