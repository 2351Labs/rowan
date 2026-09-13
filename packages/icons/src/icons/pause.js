import { createIcon } from "../icon.js";

const definition = {
  name: "pause",
  nodes: [
    [
      "rect",
      {
        x: "14",
        y: "3",
        width: "5",
        height: "18",
        rx: "1",
      },
    ],
    [
      "rect",
      {
        x: "5",
        y: "3",
        width: "5",
        height: "18",
        rx: "1",
      },
    ],
  ],
};

/**
 * Creates the pause icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Pause(options) {
  return createIcon(definition, options);
}

export default Pause;
