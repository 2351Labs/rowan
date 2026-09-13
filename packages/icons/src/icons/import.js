import { createIcon } from "../icon.js";

const definition = {
  name: "import",
  nodes: [
    [
      "path",
      {
        d: "M12 3v12",
      },
    ],
    [
      "path",
      {
        d: "m8 11 4 4 4-4",
      },
    ],
    [
      "path",
      {
        d: "M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4",
      },
    ],
  ],
};

/**
 * Creates the import icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Import(options) {
  return createIcon(definition, options);
}

export default Import;
