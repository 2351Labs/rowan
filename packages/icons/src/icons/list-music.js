import { createIcon } from "../icon.js";

const definition = {
  name: "list-music",
  nodes: [
    [
      "path",
      {
        d: "M16 5H3",
      },
    ],
    [
      "path",
      {
        d: "M11 12H3",
      },
    ],
    [
      "path",
      {
        d: "M11 19H3",
      },
    ],
    [
      "path",
      {
        d: "M21 16V5",
      },
    ],
    [
      "circle",
      {
        cx: "18",
        cy: "16",
        r: "3",
      },
    ],
  ],
};

/**
 * Creates the list-music icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ListMusic(options) {
  return createIcon(definition, options);
}

export default ListMusic;
