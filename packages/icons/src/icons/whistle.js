import { createIcon } from "../icon.js";

const definition = {
  name: "whistle",
  nodes: [
    [
      "path",
      {
        d: "M10 6v4",
      },
    ],
    [
      "path",
      {
        d: "M21 6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5.675A7 7 0 1 1 9 6z",
      },
    ],
  ],
};

/**
 * Creates the whistle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Whistle(options) {
  return createIcon(definition, options);
}

export default Whistle;
