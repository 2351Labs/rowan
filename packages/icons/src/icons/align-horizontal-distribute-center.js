import { createIcon } from "../icon.js";

const definition = {
  name: "align-horizontal-distribute-center",
  nodes: [
    [
      "rect",
      {
        width: "6",
        height: "14",
        x: "4",
        y: "5",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        width: "6",
        height: "10",
        x: "14",
        y: "7",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M17 22v-5",
      },
    ],
    [
      "path",
      {
        d: "M17 7V2",
      },
    ],
    [
      "path",
      {
        d: "M7 22v-3",
      },
    ],
    [
      "path",
      {
        d: "M7 5V2",
      },
    ],
  ],
};

/**
 * Creates the align-horizontal-distribute-center icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AlignHorizontalDistributeCenter(options) {
  return createIcon(definition, options);
}

export default AlignHorizontalDistributeCenter;
