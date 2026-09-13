import { createIcon } from "../icon.js";

const definition = {
  name: "face-slightly-frowning",
  nodes: [
    [
      "path",
      {
        d: "M15 10V9",
      },
    ],
    [
      "path",
      {
        d: "M9 10V9",
      },
    ],
    [
      "path",
      {
        d: "M9 16a5 5 0 016 0",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
  ],
};

/**
 * Creates the face-slightly-frowning icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FaceSlightlyFrowning(options) {
  return createIcon(definition, options);
}

export default FaceSlightlyFrowning;
