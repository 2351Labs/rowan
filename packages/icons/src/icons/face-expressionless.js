import { createIcon } from "../icon.js";

const definition = {
  name: "face-expressionless",
  nodes: [
    [
      "path",
      {
        d: "M14 10h2",
      },
    ],
    [
      "path",
      {
        d: "M8 10h2",
      },
    ],
    [
      "path",
      {
        d: "M8 16h8",
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
 * Creates the face-expressionless icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FaceExpressionless(options) {
  return createIcon(definition, options);
}

export default FaceExpressionless;
