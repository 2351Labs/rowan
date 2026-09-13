import { createIcon } from "../icon.js";

const definition = {
  name: "rotate-3d",
  nodes: [
    [
      "path",
      {
        d: "m15.194 13.707 3.814 1.86-1.86 3.814",
      },
    ],
    [
      "path",
      {
        d: "M16.47214 7.52786 A 5 10 0 1 0 13 21.79796",
      },
    ],
    [
      "path",
      {
        d: "M21.79796 11 A 10 5 0 1 0 19 15.57071",
      },
    ],
  ],
};

/**
 * Creates the rotate-3d icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Rotate3d(options) {
  return createIcon(definition, options);
}

export default Rotate3d;
