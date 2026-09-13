import { createIcon } from "../icon.js";

const definition = {
  name: "ligature",
  nodes: [
    [
      "path",
      {
        d: "M14 12h2v8",
      },
    ],
    [
      "path",
      {
        d: "M14 20h4",
      },
    ],
    [
      "path",
      {
        d: "M6 12h4",
      },
    ],
    [
      "path",
      {
        d: "M6 20h4",
      },
    ],
    [
      "path",
      {
        d: "M8 20V8a4 4 0 0 1 7.464-2",
      },
    ],
  ],
};

/**
 * Creates the ligature icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Ligature(options) {
  return createIcon(definition, options);
}

export default Ligature;
