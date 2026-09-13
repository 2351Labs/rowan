import { createIcon } from "../icon.js";

const definition = {
  name: "unlock-keyhole",
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
        width: "18",
        height: "12",
        x: "3",
        y: "10",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M7 10V7a5 5 0 0 1 9.33-2.5",
      },
    ],
  ],
};

/**
 * Creates the unlock-keyhole icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function UnlockKeyhole(options) {
  return createIcon(definition, options);
}

export default UnlockKeyhole;
