import { createIcon } from "../icon.js";

const definition = {
  name: "rss",
  nodes: [
    [
      "path",
      {
        d: "M4 11a9 9 0 0 1 9 9",
      },
    ],
    [
      "path",
      {
        d: "M4 4a16 16 0 0 1 16 16",
      },
    ],
    [
      "circle",
      {
        cx: "5",
        cy: "19",
        r: "1",
      },
    ],
  ],
};

/**
 * Creates the rss icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Rss(options) {
  return createIcon(definition, options);
}

export default Rss;
