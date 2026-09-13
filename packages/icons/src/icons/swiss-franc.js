import { createIcon } from "../icon.js";

const definition = {
  name: "swiss-franc",
  nodes: [
    [
      "path",
      {
        d: "M10 21V3h8",
      },
    ],
    [
      "path",
      {
        d: "M6 16h9",
      },
    ],
    [
      "path",
      {
        d: "M10 9.5h7",
      },
    ],
  ],
};

/**
 * Creates the swiss-franc icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SwissFranc(options) {
  return createIcon(definition, options);
}

export default SwissFranc;
