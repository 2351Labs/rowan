import { createIcon } from "../icon.js";

const definition = {
  name: "code-2",
  nodes: [
    [
      "path",
      {
        d: "m18 16 4-4-4-4",
      },
    ],
    [
      "path",
      {
        d: "m6 8-4 4 4 4",
      },
    ],
    [
      "path",
      {
        d: "m14.5 4-5 16",
      },
    ],
  ],
};

/**
 * Creates the code-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Code2(options) {
  return createIcon(definition, options);
}

export default Code2;
