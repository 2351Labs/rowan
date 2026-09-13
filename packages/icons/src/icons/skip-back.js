import { createIcon } from "../icon.js";

const definition = {
  name: "skip-back",
  nodes: [
    [
      "path",
      {
        d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      },
    ],
    [
      "path",
      {
        d: "M3 20V4",
      },
    ],
  ],
};

/**
 * Creates the skip-back icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SkipBack(options) {
  return createIcon(definition, options);
}

export default SkipBack;
