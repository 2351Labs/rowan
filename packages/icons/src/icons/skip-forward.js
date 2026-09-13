import { createIcon } from "../icon.js";

const definition = {
  name: "skip-forward",
  nodes: [
    [
      "path",
      {
        d: "M21 4v16",
      },
    ],
    [
      "path",
      {
        d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      },
    ],
  ],
};

/**
 * Creates the skip-forward icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SkipForward(options) {
  return createIcon(definition, options);
}

export default SkipForward;
