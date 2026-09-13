import { createIcon } from "../icon.js";

const definition = {
  name: "heading-3",
  nodes: [
    [
      "path",
      {
        d: "M4 12h8",
      },
    ],
    [
      "path",
      {
        d: "M4 18V6",
      },
    ],
    [
      "path",
      {
        d: "M12 18V6",
      },
    ],
    [
      "path",
      {
        d: "M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2",
      },
    ],
    [
      "path",
      {
        d: "M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2",
      },
    ],
  ],
};

/**
 * Creates the heading-3 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Heading3(options) {
  return createIcon(definition, options);
}

export default Heading3;
