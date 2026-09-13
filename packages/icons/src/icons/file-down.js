import { createIcon } from "../icon.js";

const definition = {
  name: "file-down",
  nodes: [
    [
      "path",
      {
        d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      },
    ],
    [
      "path",
      {
        d: "M14 2v5a1 1 0 0 0 1 1h5",
      },
    ],
    [
      "path",
      {
        d: "M12 18v-6",
      },
    ],
    [
      "path",
      {
        d: "m9 15 3 3 3-3",
      },
    ],
  ],
};

/**
 * Creates the file-down icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FileDown(options) {
  return createIcon(definition, options);
}

export default FileDown;
