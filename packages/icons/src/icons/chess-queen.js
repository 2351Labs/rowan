import { createIcon } from "../icon.js";

const definition = {
  name: "chess-queen",
  nodes: [
    [
      "path",
      {
        d: "M4 20a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z",
      },
    ],
    [
      "path",
      {
        d: "m12.474 5.943 1.567 5.34a1 1 0 0 0 1.75.328l2.616-3.402",
      },
    ],
    [
      "path",
      {
        d: "m20 9-3 9",
      },
    ],
    [
      "path",
      {
        d: "m5.594 8.209 2.615 3.403a1 1 0 0 0 1.75-.329l1.567-5.34",
      },
    ],
    [
      "path",
      {
        d: "M7 18 4 9",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "4",
        r: "2",
      },
    ],
    [
      "circle",
      {
        cx: "20",
        cy: "7",
        r: "2",
      },
    ],
    [
      "circle",
      {
        cx: "4",
        cy: "7",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the chess-queen icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChessQueen(options) {
  return createIcon(definition, options);
}

export default ChessQueen;
