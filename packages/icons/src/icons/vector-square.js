import { createIcon } from "../icon.js";

const definition = {
  name: "vector-square",
  nodes: [
    [
      "path",
      {
        d: "M17.055 4.533a24 24 0 00-10.11 0",
      },
    ],
    [
      "path",
      {
        d: "M19.467 17.055a24 24 0 000-10.11",
      },
    ],
    [
      "path",
      {
        d: "M4.533 6.945a24 24 0 000 10.11",
      },
    ],
    [
      "path",
      {
        d: "M6.945 19.467a24 24 0 0010.11 0",
      },
    ],
    [
      "circle",
      {
        cx: "19",
        cy: "19",
        r: "2",
      },
    ],
    [
      "circle",
      {
        cx: "19",
        cy: "5",
        r: "2",
      },
    ],
    [
      "circle",
      {
        cx: "5",
        cy: "19",
        r: "2",
      },
    ],
    [
      "circle",
      {
        cx: "5",
        cy: "5",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the vector-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function VectorSquare(options) {
  return createIcon(definition, options);
}

export default VectorSquare;
