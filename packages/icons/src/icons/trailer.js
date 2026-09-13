import { createIcon } from "../icon.js";

const definition = {
  name: "trailer",
  nodes: [
    [
      "path",
      {
        d: "M10 11.341V10",
      },
    ],
    [
      "path",
      {
        d: "M14 13v-3",
      },
    ],
    [
      "path",
      {
        d: "M18 17V8a2 2 0 00-2-2H4a2 2 0 00-2 2v7a2 2 0 002 2h2",
      },
    ],
    [
      "path",
      {
        d: "M22 15v1a1 1 0 01-1 1H10",
      },
    ],
    [
      "path",
      {
        d: "M6 11.341V10",
      },
    ],
    [
      "circle",
      {
        cx: "8",
        cy: "17",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the trailer icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Trailer(options) {
  return createIcon(definition, options);
}

export default Trailer;
