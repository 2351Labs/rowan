import { createIcon } from "../icon.js";

const definition = {
  name: "section",
  nodes: [
    [
      "path",
      {
        d: "M16 5a4 3 0 0 0-8 0c0 4 8 3 8 7a4 3 0 0 1-8 0",
      },
    ],
    [
      "path",
      {
        d: "M8 19a4 3 0 0 0 8 0c0-4-8-3-8-7a4 3 0 0 1 8 0",
      },
    ],
  ],
};

/**
 * Creates the section icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Section(options) {
  return createIcon(definition, options);
}

export default Section;
