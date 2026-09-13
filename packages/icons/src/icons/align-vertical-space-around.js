import { createIcon } from "../icon.js";

const definition = {
  name: "align-vertical-space-around",
  nodes: [
    [
      "rect",
      {
        width: "10",
        height: "6",
        x: "7",
        y: "9",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M22 20H2",
      },
    ],
    [
      "path",
      {
        d: "M22 4H2",
      },
    ],
  ],
};

/**
 * Creates the align-vertical-space-around icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AlignVerticalSpaceAround(options) {
  return createIcon(definition, options);
}

export default AlignVerticalSpaceAround;
