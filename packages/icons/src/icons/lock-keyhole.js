import { createIcon } from "../icon.js";

const definition = {
  name: "lock-keyhole",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "16",
        r: "1",
      },
    ],
    [
      "rect",
      {
        x: "3",
        y: "10",
        width: "18",
        height: "12",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M7 10V7a5 5 0 0 1 10 0v3",
      },
    ],
  ],
};

/**
 * Creates the lock-keyhole icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function LockKeyhole(options) {
  return createIcon(definition, options);
}

export default LockKeyhole;
