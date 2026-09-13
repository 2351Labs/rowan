import { createIcon } from "../icon.js";

const definition = {
  name: "music-4",
  nodes: [
    [
      "path",
      {
        d: "M9 18V5l12-2v13",
      },
    ],
    [
      "path",
      {
        d: "m9 9 12-2",
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
 * Creates the music-4 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Music4(options) {
  return createIcon(definition, options);
}

export default Music4;
