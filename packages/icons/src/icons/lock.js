import { createIcon } from "../icon.js";

const definition = {
  name: "lock",
  nodes: [
    [
      "rect",
      {
        width: "18",
        height: "11",
        x: "3",
        y: "11",
        rx: "2",
        ry: "2",
      },
    ],
    [
      "path",
      {
        d: "M7 11V7a5 5 0 0 1 10 0v4",
      },
    ],
  ],
};

/**
 * Creates the lock icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Lock(options) {
  return createIcon(definition, options);
}

export default Lock;
