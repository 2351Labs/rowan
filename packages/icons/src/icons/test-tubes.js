import { createIcon } from "../icon.js";

const definition = {
  name: "test-tubes",
  nodes: [
    [
      "path",
      {
        d: "M9 2v17.5A2.5 2.5 0 0 1 6.5 22A2.5 2.5 0 0 1 4 19.5V2",
      },
    ],
    [
      "path",
      {
        d: "M20 2v17.5a2.5 2.5 0 0 1-2.5 2.5a2.5 2.5 0 0 1-2.5-2.5V2",
      },
    ],
    [
      "path",
      {
        d: "M3 2h7",
      },
    ],
    [
      "path",
      {
        d: "M14 2h7",
      },
    ],
    [
      "path",
      {
        d: "M9 16H4",
      },
    ],
    [
      "path",
      {
        d: "M20 16h-5",
      },
    ],
  ],
};

/**
 * Creates the test-tubes icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TestTubes(options) {
  return createIcon(definition, options);
}

export default TestTubes;
