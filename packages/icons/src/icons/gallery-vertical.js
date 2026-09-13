import { createIcon } from "../icon.js";

const definition = {
  name: "gallery-vertical",
  nodes: [
    [
      "path",
      {
        d: "M3 2h18",
      },
    ],
    [
      "rect",
      {
        width: "18",
        height: "12",
        x: "3",
        y: "6",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M3 22h18",
      },
    ],
  ],
};

/**
 * Creates the gallery-vertical icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GalleryVertical(options) {
  return createIcon(definition, options);
}

export default GalleryVertical;
