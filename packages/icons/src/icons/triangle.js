import { createIcon } from "../icon.js";

const definition = {
  name: "triangle",
  nodes: [
    [
      "path",
      {
        d: "M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",
      },
    ],
  ],
};

/**
 * Creates the triangle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Triangle(options) {
  return createIcon(definition, options);
}

export default Triangle;
