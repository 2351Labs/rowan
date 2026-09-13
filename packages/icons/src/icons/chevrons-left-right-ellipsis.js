import { createIcon } from "../icon.js";

const definition = {
  name: "chevrons-left-right-ellipsis",
  nodes: [
    [
      "path",
      {
        d: "M12 12h.01",
      },
    ],
    [
      "path",
      {
        d: "M16 12h.01",
      },
    ],
    [
      "path",
      {
        d: "m17 7 5 5-5 5",
      },
    ],
    [
      "path",
      {
        d: "m7 7-5 5 5 5",
      },
    ],
    [
      "path",
      {
        d: "M8 12h.01",
      },
    ],
  ],
};

/**
 * Creates the chevrons-left-right-ellipsis icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ChevronsLeftRightEllipsis(options) {
  return createIcon(definition, options);
}

export default ChevronsLeftRightEllipsis;
