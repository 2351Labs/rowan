import { createIcon } from "../icon.js";

const definition = {
  name: "music-2",
  nodes: [
    [
      "circle",
      {
        cx: "8",
        cy: "18",
        r: "4",
      },
    ],
    [
      "path",
      {
        d: "M12 18V2l7 4",
      },
    ],
  ],
};

/**
 * Creates the music-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Music2(options) {
  return createIcon(definition, options);
}

export default Music2;
