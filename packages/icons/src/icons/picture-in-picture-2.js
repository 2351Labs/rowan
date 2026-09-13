import { createIcon } from "../icon.js";

const definition = {
  name: "picture-in-picture-2",
  nodes: [
    [
      "path",
      {
        d: "M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h4",
      },
    ],
    [
      "rect",
      {
        width: "10",
        height: "7",
        x: "12",
        y: "13",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the picture-in-picture-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PictureInPicture2(options) {
  return createIcon(definition, options);
}

export default PictureInPicture2;
