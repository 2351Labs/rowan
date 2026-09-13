import { createIcon } from "../icon.js";

const definition = {
  name: "gallery-horizontal",
  nodes: [
    [
      "path",
      {
        d: "M2 3v18",
      },
    ],
    [
      "rect",
      {
        width: "12",
        height: "18",
        x: "6",
        y: "3",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M22 3v18",
      },
    ],
  ],
};

/**
 * Creates the gallery-horizontal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GalleryHorizontal(options) {
  return createIcon(definition, options);
}

export default GalleryHorizontal;
