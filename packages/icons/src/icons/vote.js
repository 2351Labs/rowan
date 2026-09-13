import { createIcon } from "../icon.js";

const definition = {
  name: "vote",
  nodes: [
    [
      "path",
      {
        d: "m9 12 2 2 4-4",
      },
    ],
    [
      "path",
      {
        d: "M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z",
      },
    ],
    [
      "path",
      {
        d: "M22 19H2",
      },
    ],
  ],
};

/**
 * Creates the vote icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Vote(options) {
  return createIcon(definition, options);
}

export default Vote;
