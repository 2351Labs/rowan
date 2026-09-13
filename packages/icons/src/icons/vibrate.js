import { createIcon } from "../icon.js";

const definition = {
  name: "vibrate",
  nodes: [
    [
      "path",
      {
        d: "m2 8 2 2-2 2 2 2-2 2",
      },
    ],
    [
      "path",
      {
        d: "m22 8-2 2 2 2-2 2 2 2",
      },
    ],
    [
      "rect",
      {
        width: "8",
        height: "14",
        x: "8",
        y: "5",
        rx: "1",
      },
    ],
  ],
};

/**
 * Creates the vibrate icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Vibrate(options) {
  return createIcon(definition, options);
}

export default Vibrate;
