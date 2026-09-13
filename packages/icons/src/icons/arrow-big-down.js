import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-big-down",
  nodes: [
    [
      "path",
      {
        d: "M9 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 0 1 1h3.293a.707.707 0 0 1 .5 1.207l-7.086 7.086a1 1 0 0 1-1.414 0l-7.086-7.086a.707.707 0 0 1 .5-1.207H8a1 1 0 0 0 1-1z",
      },
    ],
  ],
};

/**
 * Creates the arrow-big-down icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowBigDown(options) {
  return createIcon(definition, options);
}

export default ArrowBigDown;
