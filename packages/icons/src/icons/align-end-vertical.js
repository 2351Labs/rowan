import { createIcon } from "../icon.js";

const definition = {
  name: "align-end-vertical",
  nodes: [
    [
      "rect",
      {
        width: "16",
        height: "6",
        x: "2",
        y: "4",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        width: "9",
        height: "6",
        x: "9",
        y: "14",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M22 22V2",
      },
    ],
  ],
};

/**
 * Creates the align-end-vertical icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AlignEndVertical(options) {
  return createIcon(definition, options);
}

export default AlignEndVertical;
