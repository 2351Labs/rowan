import { createIcon } from "../icon.js";

const definition = {
  name: "file-chart-line",
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
        d: "m16 13-3.5 3.5-2-2L8 17",
      },
    ],
  ],
};

/**
 * Creates the file-chart-line icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FileChartLine(options) {
  return createIcon(definition, options);
}

export default FileChartLine;
