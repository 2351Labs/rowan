import { createIcon } from "../icon.js";

const definition = {
  name: "pound-sterling",
  nodes: [
    [
      "path",
      {
        d: "M18 7c0-5.333-8-5.333-8 0",
      },
    ],
    [
      "path",
      {
        d: "M10 7v14",
      },
    ],
    [
      "path",
      {
        d: "M6 21h12",
      },
    ],
    [
      "path",
      {
        d: "M6 13h10",
      },
    ],
  ],
};

/**
 * Creates the pound-sterling icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PoundSterling(options) {
  return createIcon(definition, options);
}

export default PoundSterling;
