import { createIcon } from "../icon.js";

const definition = {
  name: "move",
  nodes: [
    [
      "path",
      {
        d: "M12 2v20",
      },
    ],
    [
      "path",
      {
        d: "m15 19-3 3-3-3",
      },
    ],
    [
      "path",
      {
        d: "m19 9 3 3-3 3",
      },
    ],
    [
      "path",
      {
        d: "M2 12h20",
      },
    ],
    [
      "path",
      {
        d: "m5 9-3 3 3 3",
      },
    ],
    [
      "path",
      {
        d: "m9 5 3-3 3 3",
      },
    ],
  ],
};

/**
 * Creates the move icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Move(options) {
  return createIcon(definition, options);
}

export default Move;
