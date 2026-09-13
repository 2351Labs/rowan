import { createIcon } from "../icon.js";

const definition = {
  name: "gallery-horizontal-end",
  nodes: [
    [
      "path",
      {
        d: "M2 7v10",
      },
    ],
    [
      "path",
      {
        d: "M6 5v14",
      },
    ],
    [
      "rect",
      {
        width: "12",
        height: "18",
        x: "10",
        y: "3",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the gallery-horizontal-end icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GalleryHorizontalEnd(options) {
  return createIcon(definition, options);
}

export default GalleryHorizontalEnd;
