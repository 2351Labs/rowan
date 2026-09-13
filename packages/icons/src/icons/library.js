import { createIcon } from "../icon.js";

const definition = {
  name: "library",
  nodes: [
    [
      "path",
      {
        d: "m16 6 4 14",
      },
    ],
    [
      "path",
      {
        d: "M12 6v14",
      },
    ],
    [
      "path",
      {
        d: "M8 8v12",
      },
    ],
    [
      "path",
      {
        d: "M4 4v16",
      },
    ],
  ],
};

/**
 * Creates the library icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Library(options) {
  return createIcon(definition, options);
}

export default Library;
