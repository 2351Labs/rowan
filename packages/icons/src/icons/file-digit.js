import { createIcon } from "../icon.js";

const definition = {
  name: "file-digit",
  nodes: [
    [
      "path",
      {
        d: "M4 12V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2",
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
        d: "M10 16h2v6",
      },
    ],
    [
      "path",
      {
        d: "M10 22h4",
      },
    ],
    [
      "rect",
      {
        x: "2",
        y: "16",
        width: "4",
        height: "6",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the file-digit icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FileDigit(options) {
  return createIcon(definition, options);
}

export default FileDigit;
