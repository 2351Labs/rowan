import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-big-left-dash",
  nodes: [
    [
      "path",
      {
        d: "M13 9a1 1 0 0 1-1-1V4.707a.707.707 0 0 0-1.207-.5l-6.94 6.94a1.207 1.207 0 0 0 0 1.707l6.94 6.94a.707.707 0 0 0 1.207-.5V16a1 1 0 0 1 1-1h2a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z",
      },
    ],
    [
      "path",
      {
        d: "M20 9v6",
      },
    ],
  ],
};

/**
 * Creates the arrow-big-left-dash icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowBigLeftDash(options) {
  return createIcon(definition, options);
}

export default ArrowBigLeftDash;
