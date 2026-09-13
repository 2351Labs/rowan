import { createIcon } from "../icon.js";

const definition = {
  name: "tv",
  nodes: [
    [
      "path",
      {
        d: "m17 2-5 5-5-5",
      },
    ],
    [
      "rect",
      {
        width: "20",
        height: "15",
        x: "2",
        y: "7",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the tv icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Tv(options) {
  return createIcon(definition, options);
}

export default Tv;
