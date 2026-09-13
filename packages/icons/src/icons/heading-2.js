import { createIcon } from "../icon.js";

const definition = {
  name: "heading-2",
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
        d: "M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1",
      },
    ],
  ],
};

/**
 * Creates the heading-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Heading2(options) {
  return createIcon(definition, options);
}

export default Heading2;
