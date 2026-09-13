import { createIcon } from "../icon.js";

const definition = {
  name: "toggle-left",
  nodes: [
    [
      "circle",
      {
        cx: "9",
        cy: "12",
        r: "3",
      },
    ],
    [
      "rect",
      {
        width: "20",
        height: "14",
        x: "2",
        y: "5",
        rx: "7",
      },
    ],
  ],
};

/**
 * Creates the toggle-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ToggleLeft(options) {
  return createIcon(definition, options);
}

export default ToggleLeft;
