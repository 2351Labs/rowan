import { createIcon } from "../icon.js";

const definition = {
  name: "motorbike",
  nodes: [
    [
      "path",
      {
        d: "m18 14-1-3",
      },
    ],
    [
      "path",
      {
        d: "m3 9 6 2a2 2 0 0 1 2-2h2a2 2 0 0 1 1.99 1.81",
      },
    ],
    [
      "path",
      {
        d: "M8 17h3a1 1 0 0 0 1-1 6 6 0 0 1 6-6 1 1 0 0 0 1-1v-.75A5 5 0 0 0 17 5",
      },
    ],
    [
      "circle",
      {
        cx: "19",
        cy: "17",
        r: "3",
      },
    ],
    [
      "circle",
      {
        cx: "5",
        cy: "17",
        r: "3",
      },
    ],
  ],
};

/**
 * Creates the motorbike icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Motorbike(options) {
  return createIcon(definition, options);
}

export default Motorbike;
