import { createIcon } from "../icon.js";

const definition = {
  name: "image",
  nodes: [
    [
      "rect",
      {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2",
        ry: "2",
      },
    ],
    [
      "circle",
      {
        cx: "9",
        cy: "9",
        r: "2",
      },
    ],
    [
      "path",
      {
        d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
      },
    ],
  ],
};

/**
 * Creates the image icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Image(options) {
  return createIcon(definition, options);
}

export default Image;
