import { createIcon } from "../icon.js";

const definition = {
  name: "square-dashed-bottom-code",
  nodes: [
    [
      "path",
      {
        d: "M10 9.5 8 12l2 2.5",
      },
    ],
    [
      "path",
      {
        d: "M14 21h1",
      },
    ],
    [
      "path",
      {
        d: "m14 9.5 2 2.5-2 2.5",
      },
    ],
    [
      "path",
      {
        d: "M5 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2",
      },
    ],
    [
      "path",
      {
        d: "M9 21h1",
      },
    ],
  ],
};

/**
 * Creates the square-dashed-bottom-code icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareDashedBottomCode(options) {
  return createIcon(definition, options);
}

export default SquareDashedBottomCode;
