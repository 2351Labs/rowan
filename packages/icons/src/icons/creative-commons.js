import { createIcon } from "../icon.js";

const definition = {
  name: "creative-commons",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
    [
      "path",
      {
        d: "M10 9.3a2.8 2.8 0 0 0-3.5 1 3.1 3.1 0 0 0 0 3.4 2.7 2.7 0 0 0 3.5 1",
      },
    ],
    [
      "path",
      {
        d: "M17 9.3a2.8 2.8 0 0 0-3.5 1 3.1 3.1 0 0 0 0 3.4 2.7 2.7 0 0 0 3.5 1",
      },
    ],
  ],
};

/**
 * Creates the creative-commons icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CreativeCommons(options) {
  return createIcon(definition, options);
}

export default CreativeCommons;
