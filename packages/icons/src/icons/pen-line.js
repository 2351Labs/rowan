import { createIcon } from "../icon.js";

const definition = {
  name: "pen-line",
  nodes: [
    [
      "path",
      {
        d: "M13 21h8",
      },
    ],
    [
      "path",
      {
        d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      },
    ],
  ],
};

/**
 * Creates the pen-line icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PenLine(options) {
  return createIcon(definition, options);
}

export default PenLine;
