import { createIcon } from "../icon.js";

const definition = {
  name: "square-mouse-pointer",
  nodes: [
    [
      "path",
      {
        d: "M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z",
      },
    ],
    [
      "path",
      {
        d: "M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6",
      },
    ],
  ],
};

/**
 * Creates the square-mouse-pointer icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SquareMousePointer(options) {
  return createIcon(definition, options);
}

export default SquareMousePointer;
