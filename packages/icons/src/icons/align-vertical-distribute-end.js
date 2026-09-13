import { createIcon } from "../icon.js";

const definition = {
  name: "align-vertical-distribute-end",
  nodes: [
    [
      "rect",
      {
        width: "14",
        height: "6",
        x: "5",
        y: "14",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        width: "10",
        height: "6",
        x: "7",
        y: "4",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M2 20h20",
      },
    ],
    [
      "path",
      {
        d: "M2 10h20",
      },
    ],
  ],
};

/**
 * Creates the align-vertical-distribute-end icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AlignVerticalDistributeEnd(options) {
  return createIcon(definition, options);
}

export default AlignVerticalDistributeEnd;
