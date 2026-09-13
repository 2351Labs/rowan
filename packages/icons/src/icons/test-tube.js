import { createIcon } from "../icon.js";

const definition = {
  name: "test-tube",
  nodes: [
    [
      "path",
      {
        d: "M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2",
      },
    ],
    [
      "path",
      {
        d: "M8.5 2h7",
      },
    ],
    [
      "path",
      {
        d: "M14.5 16h-5",
      },
    ],
  ],
};

/**
 * Creates the test-tube icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TestTube(options) {
  return createIcon(definition, options);
}

export default TestTube;
