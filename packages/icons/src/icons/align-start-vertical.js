import { createIcon } from "../icon.js";

const definition = {
  name: "align-start-vertical",
  nodes: [
    [
      "rect",
      {
        width: "9",
        height: "6",
        x: "6",
        y: "14",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        width: "16",
        height: "6",
        x: "6",
        y: "4",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M2 2v20",
      },
    ],
  ],
};

/**
 * Creates the align-start-vertical icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AlignStartVertical(options) {
  return createIcon(definition, options);
}

export default AlignStartVertical;
