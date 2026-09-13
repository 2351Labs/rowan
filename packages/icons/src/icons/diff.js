import { createIcon } from "../icon.js";

const definition = {
  name: "diff",
  nodes: [
    [
      "path",
      {
        d: "M12 3v14",
      },
    ],
    [
      "path",
      {
        d: "M5 10h14",
      },
    ],
    [
      "path",
      {
        d: "M5 21h14",
      },
    ],
  ],
};

/**
 * Creates the diff icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Diff(options) {
  return createIcon(definition, options);
}

export default Diff;
