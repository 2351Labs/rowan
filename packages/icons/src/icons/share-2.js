import { createIcon } from "../icon.js";

const definition = {
  name: "share-2",
  nodes: [
    [
      "circle",
      {
        cx: "18",
        cy: "5",
        r: "3",
      },
    ],
    [
      "circle",
      {
        cx: "6",
        cy: "12",
        r: "3",
      },
    ],
    [
      "circle",
      {
        cx: "18",
        cy: "19",
        r: "3",
      },
    ],
    [
      "line",
      {
        x1: "8.59",
        x2: "15.42",
        y1: "13.51",
        y2: "17.49",
      },
    ],
    [
      "line",
      {
        x1: "15.41",
        x2: "8.59",
        y1: "6.51",
        y2: "10.49",
      },
    ],
  ],
};

/**
 * Creates the share-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Share2(options) {
  return createIcon(definition, options);
}

export default Share2;
