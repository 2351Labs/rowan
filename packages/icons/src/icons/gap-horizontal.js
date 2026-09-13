import { createIcon } from "../icon.js";

const definition = {
  name: "gap-horizontal",
  nodes: [
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
        d: "M21 3h-3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3",
      },
    ],
    [
      "path",
      {
        d: "M3 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3",
      },
    ],
  ],
};

/**
 * Creates the gap-horizontal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GapHorizontal(options) {
  return createIcon(definition, options);
}

export default GapHorizontal;
