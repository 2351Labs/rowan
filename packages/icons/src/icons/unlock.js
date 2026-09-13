import { createIcon } from "../icon.js";

const definition = {
  name: "unlock",
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
 * Creates the unlock icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Unlock(options) {
  return createIcon(definition, options);
}

export default Unlock;
