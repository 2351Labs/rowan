import { createIcon } from "../icon.js";

const definition = {
  name: "test-tube-2",
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
 * Creates the test-tube-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TestTube2(options) {
  return createIcon(definition, options);
}

export default TestTube2;
