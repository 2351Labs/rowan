import { createIcon } from "../icon.js";

const definition = {
  name: "eye-closed",
  nodes: [
    [
      "path",
      {
        d: "m15 18-.722-3.25",
      },
    ],
    [
      "path",
      {
        d: "M2 8a10.645 10.645 0 0 0 20 0",
      },
    ],
    [
      "path",
      {
        d: "m20 15-1.726-2.05",
      },
    ],
    [
      "path",
      {
        d: "m4 15 1.726-2.05",
      },
    ],
    [
      "path",
      {
        d: "m9 18 .722-3.25",
      },
    ],
  ],
};

/**
 * Creates the eye-closed icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function EyeClosed(options) {
  return createIcon(definition, options);
}

export default EyeClosed;
