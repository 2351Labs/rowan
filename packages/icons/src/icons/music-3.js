import { createIcon } from "../icon.js";

const definition = {
  name: "music-3",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "18",
        r: "4",
      },
    ],
    [
      "path",
      {
        d: "M16 18V2",
      },
    ],
  ],
};

/**
 * Creates the music-3 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Music3(options) {
  return createIcon(definition, options);
}

export default Music3;
