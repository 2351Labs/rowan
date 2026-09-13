import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-big-right-dash",
  nodes: [
    [
      "path",
      {
        d: "M11 9a1 1 0 0 0 1-1V4.707a.707.707 0 0 1 1.207-.5l6.94 6.94a1.207 1.207 0 0 1 0 1.707l-6.94 6.94a.707.707 0 0 1-1.207-.5V16a1 1 0 0 0-1-1H9a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z",
      },
    ],
    [
      "path",
      {
        d: "M4 9v6",
      },
    ],
  ],
};

/**
 * Creates the arrow-big-right-dash icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowBigRightDash(options) {
  return createIcon(definition, options);
}

export default ArrowBigRightDash;
