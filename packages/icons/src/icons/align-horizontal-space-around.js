import { createIcon } from "../icon.js";

const definition = {
  name: "align-horizontal-space-around",
  nodes: [
    [
      "rect",
      {
        width: "6",
        height: "10",
        x: "9",
        y: "7",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M4 22V2",
      },
    ],
    [
      "path",
      {
        d: "M20 22V2",
      },
    ],
  ],
};

/**
 * Creates the align-horizontal-space-around icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AlignHorizontalSpaceAround(options) {
  return createIcon(definition, options);
}

export default AlignHorizontalSpaceAround;
