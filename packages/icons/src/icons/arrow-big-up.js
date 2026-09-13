import { createIcon } from "../icon.js";

const definition = {
  name: "arrow-big-up",
  nodes: [
    [
      "path",
      {
        d: "M9 19a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-6a1 1 0 0 1 1-1h3.293a.707.707 0 0 0 .5-1.207l-7.086-7.086a1 1 0 0 0-1.414 0l-7.086 7.086a.707.707 0 0 0 .5 1.207H8a1 1 0 0 1 1 1z",
      },
    ],
  ],
};

/**
 * Creates the arrow-big-up icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArrowBigUp(options) {
  return createIcon(definition, options);
}

export default ArrowBigUp;
