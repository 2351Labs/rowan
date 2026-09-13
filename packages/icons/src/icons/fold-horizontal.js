import { createIcon } from "../icon.js";

const definition = {
  name: "fold-horizontal",
  nodes: [
    [
      "path",
      {
        d: "M2 12h6",
      },
    ],
    [
      "path",
      {
        d: "M22 12h-6",
      },
    ],
    [
      "path",
      {
        d: "M12 2v2",
      },
    ],
    [
      "path",
      {
        d: "M12 8v2",
      },
    ],
    [
      "path",
      {
        d: "M12 14v2",
      },
    ],
    [
      "path",
      {
        d: "M12 20v2",
      },
    ],
    [
      "path",
      {
        d: "m19 9-3 3 3 3",
      },
    ],
    [
      "path",
      {
        d: "m5 15 3-3-3-3",
      },
    ],
  ],
};

/**
 * Creates the fold-horizontal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FoldHorizontal(options) {
  return createIcon(definition, options);
}

export default FoldHorizontal;
