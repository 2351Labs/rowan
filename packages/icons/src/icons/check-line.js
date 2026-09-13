import { createIcon } from "../icon.js";

const definition = {
  name: "check-line",
  nodes: [
    [
      "path",
      {
        d: "M20 4L9 15",
      },
    ],
    [
      "path",
      {
        d: "M21 19L3 19",
      },
    ],
    [
      "path",
      {
        d: "M9 15L4 10",
      },
    ],
  ],
};

/**
 * Creates the check-line icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CheckLine(options) {
  return createIcon(definition, options);
}

export default CheckLine;
