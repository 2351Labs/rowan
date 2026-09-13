import { createIcon } from "../icon.js";

const definition = {
  name: "file-spreadsheet",
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
        d: "M8 13h2",
      },
    ],
    [
      "path",
      {
        d: "M14 13h2",
      },
    ],
    [
      "path",
      {
        d: "M8 17h2",
      },
    ],
    [
      "path",
      {
        d: "M14 17h2",
      },
    ],
  ],
};

/**
 * Creates the file-spreadsheet icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FileSpreadsheet(options) {
  return createIcon(definition, options);
}

export default FileSpreadsheet;
