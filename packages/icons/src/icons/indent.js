import { createIcon } from "../icon.js";

const definition = {
  name: "indent",
  nodes: [
    [
      "path",
      {
        d: "M21 5H11",
      },
    ],
    [
      "path",
      {
        d: "M21 12H11",
      },
    ],
    [
      "path",
      {
        d: "M21 19H11",
      },
    ],
    [
      "path",
      {
        d: "m3 8 4 4-4 4",
      },
    ],
  ],
};

/**
 * Creates the indent icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Indent(options) {
  return createIcon(definition, options);
}

export default Indent;
