import { createIcon } from "../icon.js";

const definition = {
  name: "mouse-right",
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
        d: "M19 10v5a7 7 0 0 1-14 0V9c0-3.527 2.608-6.515 6-7",
      },
    ],
    [
      "circle",
      {
        cx: "17",
        cy: "4",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the mouse-right icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MouseRight(options) {
  return createIcon(definition, options);
}

export default MouseRight;
