import { createIcon } from "../icon.js";

const definition = {
  name: "squares-subtract",
  nodes: [
    [
      "path",
      {
        d: "M10 22a2 2 0 0 1-2-2",
      },
    ],
    [
      "path",
      {
        d: "M16 22h-2",
      },
    ],
    [
      "path",
      {
        d: "M16 4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-5a2 2 0 0 1 2-2h5a1 1 0 0 0 1-1z",
      },
    ],
    [
      "path",
      {
        d: "M20 8a2 2 0 0 1 2 2",
      },
    ],
    [
      "path",
      {
        d: "M22 14v2",
      },
    ],
    [
      "path",
      {
        d: "M22 20a2 2 0 0 1-2 2",
      },
    ],
  ],
};

/**
 * Creates the squares-subtract icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquaresSubtract(options) {
  return createIcon(definition, options);
}

export default SquaresSubtract;
