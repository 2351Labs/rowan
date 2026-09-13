import { createIcon } from "../icon.js";

const definition = {
  name: "disc-album",
  nodes: [
    [
      "rect",
      {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "5",
      },
    ],
    [
      "path",
      {
        d: "M12 12h.01",
      },
    ],
  ],
};

/**
 * Creates the disc-album icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function DiscAlbum(options) {
  return createIcon(definition, options);
}

export default DiscAlbum;
