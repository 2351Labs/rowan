import { createIcon } from "../icon.js";

const definition = {
  name: "test-tube-diagonal",
  nodes: [
    [
      "path",
      {
        d: "M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01a2.83 2.83 0 0 1 0-4L17 3",
      },
    ],
    [
      "path",
      {
        d: "m16 2 6 6",
      },
    ],
    [
      "path",
      {
        d: "M12 16H4",
      },
    ],
  ],
};

/**
 * Creates the test-tube-diagonal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TestTubeDiagonal(options) {
  return createIcon(definition, options);
}

export default TestTubeDiagonal;
