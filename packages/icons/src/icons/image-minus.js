import { createIcon } from "../icon.js";

const definition = {
  name: "image-minus",
  nodes: [
    [
      "path",
      {
        d: "M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7",
      },
    ],
    [
      "line",
      {
        x1: "16",
        x2: "22",
        y1: "5",
        y2: "5",
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
 * Creates the image-minus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ImageMinus(options) {
  return createIcon(definition, options);
}

export default ImageMinus;
