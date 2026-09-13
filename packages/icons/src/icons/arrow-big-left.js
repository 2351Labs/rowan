import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-big-left",
  nodes: [
    [
      "path",
      {
        d: "M10.793 19.793a.707.707 0 0 0 1.207-.5V16a1 1 0 0 1 1-1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-6a1 1 0 0 1-1-1V4.707a.707.707 0 0 0-1.207-.5l-6.94 6.94a1.207 1.207 0 0 0 0 1.707z",
      },
    ],
  ],
};

/**
 * Creates the arrow-big-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowBigLeft(options) {
  return createIcon(definition, options);
}

export default ArrowBigLeft;
