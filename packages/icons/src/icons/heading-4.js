import { createIcon } from "../icon.js";

const definition = {
  name: "heading-4",
  nodes: [
    [
      "path",
      {
        d: "M12 18V6",
      },
    ],
    [
      "path",
      {
        d: "M17 10v3a1 1 0 0 0 1 1h3",
      },
    ],
    [
      "path",
      {
        d: "M21 10v8",
      },
    ],
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
  ],
};

/**
 * Creates the heading-4 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Heading4(options) {
  return createIcon(definition, options);
}

export default Heading4;
