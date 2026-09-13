import { createIcon } from "../icon.js";

const definition = {
  name: "file-input",
  nodes: [
    [
      "path",
      {
        d: "M4 11V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1",
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
        d: "M2 15h10",
      },
    ],
    [
      "path",
      {
        d: "m9 18 3-3-3-3",
      },
    ],
  ],
};

/**
 * Creates the file-input icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FileInput(options) {
  return createIcon(definition, options);
}

export default FileInput;
