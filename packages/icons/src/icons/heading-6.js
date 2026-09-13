import { createIcon } from "../icon.js";

const definition = {
  name: "heading-6",
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
      "circle",
      {
        cx: "19",
        cy: "16",
        r: "2",
      },
    ],
    [
      "path",
      {
        d: "M20 10c-2 2-3 3.5-3 6",
      },
    ],
  ],
};

/**
 * Creates the heading-6 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Heading6(options) {
  return createIcon(definition, options);
}

export default Heading6;
