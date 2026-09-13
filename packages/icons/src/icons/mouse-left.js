import { createIcon } from "../icon.js";

const definition = {
  name: "mouse-left",
  nodes: [
    [
      "path",
      {
        d: "M12 7.318V10",
      },
    ],
    [
      "path",
      {
        d: "M5 10v5a7 7 0 0 0 14 0V9c0-3.527-2.608-6.515-6-7",
      },
    ],
    [
      "circle",
      {
        cx: "7",
        cy: "4",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the mouse-left icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MouseLeft(options) {
  return createIcon(definition, options);
}

export default MouseLeft;
