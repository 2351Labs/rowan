import { createIcon } from "../icon.js";

const definition = {
  name: "mouse",
  nodes: [
    [
      "rect",
      {
        x: "5",
        y: "2",
        width: "14",
        height: "20",
        rx: "7",
      },
    ],
    [
      "path",
      {
        d: "M12 6v4",
      },
    ],
  ],
};

/**
 * Creates the mouse icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Mouse(options) {
  return createIcon(definition, options);
}

export default Mouse;
