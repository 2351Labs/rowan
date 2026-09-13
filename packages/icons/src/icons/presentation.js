import { createIcon } from "../icon.js";

const definition = {
  name: "presentation",
  nodes: [
    [
      "path",
      {
        d: "M2 3h20",
      },
    ],
    [
      "path",
      {
        d: "M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3",
      },
    ],
    [
      "path",
      {
        d: "m7 21 5-5 5 5",
      },
    ],
  ],
};

/**
 * Creates the presentation icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Presentation(options) {
  return createIcon(definition, options);
}

export default Presentation;
