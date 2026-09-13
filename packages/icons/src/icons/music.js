import { createIcon } from "../icon.js";

const definition = {
  name: "music",
  nodes: [
    [
      "path",
      {
        d: "M9 18V5l12-2v13",
      },
    ],
    [
      "circle",
      {
        cx: "6",
        cy: "18",
        r: "3",
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
 * Creates the music icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Music(options) {
  return createIcon(definition, options);
}

export default Music;
