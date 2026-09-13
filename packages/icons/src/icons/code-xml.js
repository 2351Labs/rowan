import { createIcon } from "../icon.js";

const definition = {
  name: "code-xml",
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
 * Creates the code-xml icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CodeXml(options) {
  return createIcon(definition, options);
}

export default CodeXml;
