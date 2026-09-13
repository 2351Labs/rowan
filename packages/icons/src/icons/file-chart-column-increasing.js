import { createIcon } from "../icon.js";

const definition = {
  name: "file-chart-column-increasing",
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
        d: "M8 18v-2",
      },
    ],
    [
      "path",
      {
        d: "M12 18v-4",
      },
    ],
    [
      "path",
      {
        d: "M16 18v-6",
      },
    ],
  ],
};

/**
 * Creates the file-chart-column-increasing icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FileChartColumnIncreasing(options) {
  return createIcon(definition, options);
}

export default FileChartColumnIncreasing;
