import { createIcon } from "../icon.js";

const definition = {
  name: "gallery-vertical-end",
  nodes: [
    [
      "path",
      {
        d: "M7 2h10",
      },
    ],
    [
      "path",
      {
        d: "M5 6h14",
      },
    ],
    [
      "rect",
      {
        width: "18",
        height: "12",
        x: "3",
        y: "10",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the gallery-vertical-end icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GalleryVerticalEnd(options) {
  return createIcon(definition, options);
}

export default GalleryVerticalEnd;
