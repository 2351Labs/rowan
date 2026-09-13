import { createIcon } from "../icon.js";

const definition = {
  name: "anchor",
  nodes: [
    [
      "path",
      {
        d: "M12 6v16",
      },
    ],
    [
      "path",
      {
        d: "m19 13 2-1a9 9 0 0 1-18 0l2 1",
      },
    ],
    [
      "path",
      {
        d: "M9 11h6",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "4",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the anchor icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Anchor(options) {
  return createIcon(definition, options);
}

export default Anchor;
