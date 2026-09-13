import { createIcon } from "../icon.js";

const definition = {
  name: "heading",
  nodes: [
    [
      "path",
      {
        d: "M6 12h12",
      },
    ],
    [
      "path",
      {
        d: "M6 20V4",
      },
    ],
    [
      "path",
      {
        d: "M18 20V4",
      },
    ],
  ],
};

/**
 * Creates the heading icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Heading(options) {
  return createIcon(definition, options);
}

export default Heading;
