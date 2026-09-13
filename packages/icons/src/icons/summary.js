import { createIcon } from "../icon.js";

const definition = {
  name: "summary",
  nodes: [
    [
      "path",
      {
        d: "M15 4H7",
      },
    ],
    [
      "path",
      {
        d: "m18 16 3 3-3 3",
      },
    ],
    [
      "path",
      {
        d: "M3 4v13a2 2 0 0 0 2 2h16",
      },
    ],
    [
      "path",
      {
        d: "M7 14h7",
      },
    ],
    [
      "path",
      {
        d: "M7 9h12",
      },
    ],
  ],
};

/**
 * Creates the summary icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Summary(options) {
  return createIcon(definition, options);
}

export default Summary;
