import { createIcon } from "../icon.js";

const definition = {
  name: "align-horizontal-distribute-end",
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
        d: "M10 2v20",
      },
    ],
    [
      "path",
      {
        d: "M20 2v20",
      },
    ],
  ],
};

/**
 * Creates the align-horizontal-distribute-end icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AlignHorizontalDistributeEnd(options) {
  return createIcon(definition, options);
}

export default AlignHorizontalDistributeEnd;
