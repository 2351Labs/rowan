import { createIcon } from "../icon.js";

const definition = {
  name: "heading-1",
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
        d: "m17 12 3-2v8",
      },
    ],
  ],
};

/**
 * Creates the heading-1 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Heading1(options) {
  return createIcon(definition, options);
}

export default Heading1;
