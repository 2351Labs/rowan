import { createIcon } from "../icon.js";

const definition = {
  name: "unfold-horizontal",
  nodes: [
    [
      "path",
      {
        d: "M16 12h6",
      },
    ],
    [
      "path",
      {
        d: "M8 12H2",
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
        d: "m19 15 3-3-3-3",
      },
    ],
    [
      "path",
      {
        d: "m5 9-3 3 3 3",
      },
    ],
  ],
};

/**
 * Creates the unfold-horizontal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function UnfoldHorizontal(options) {
  return createIcon(definition, options);
}

export default UnfoldHorizontal;
