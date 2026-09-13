import { createIcon } from "../icon.js";

const definition = {
  name: "lock-open",
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
        d: "M7 11V7a5 5 0 0 1 9.9-1",
      },
    ],
  ],
};

/**
 * Creates the lock-open icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function LockOpen(options) {
  return createIcon(definition, options);
}

export default LockOpen;
