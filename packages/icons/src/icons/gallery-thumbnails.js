import { createIcon } from "../icon.js";

const definition = {
  name: "gallery-thumbnails",
  nodes: [
    [
      "rect",
      {
        width: "18",
        height: "14",
        x: "3",
        y: "3",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M4 21h1",
      },
    ],
    [
      "path",
      {
        d: "M9 21h1",
      },
    ],
    [
      "path",
      {
        d: "M14 21h1",
      },
    ],
    [
      "path",
      {
        d: "M19 21h1",
      },
    ],
  ],
};

/**
 * Creates the gallery-thumbnails icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GalleryThumbnails(options) {
  return createIcon(definition, options);
}

export default GalleryThumbnails;
