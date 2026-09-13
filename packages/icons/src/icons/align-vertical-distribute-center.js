import { createIcon } from "../icon.js";

const definition = {
  name: "align-vertical-distribute-center",
  nodes: [
    [
      "path",
      {
        d: "M22 17h-3",
      },
    ],
    [
      "path",
      {
        d: "M22 7h-5",
      },
    ],
    [
      "path",
      {
        d: "M5 17H2",
      },
    ],
    [
      "path",
      {
        d: "M7 7H2",
      },
    ],
    [
      "rect",
      {
        x: "5",
        y: "14",
        width: "14",
        height: "6",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        x: "7",
        y: "4",
        width: "10",
        height: "6",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the align-vertical-distribute-center icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AlignVerticalDistributeCenter(options) {
  return createIcon(definition, options);
}

export default AlignVerticalDistributeCenter;
