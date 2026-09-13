import { createIcon } from "../icon.js";

const definition = {
  name: "file-lock-2",
  nodes: [
    [
      "path",
      {
        d: "M4 9.8V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2h-3",
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
        d: "M9 17v-2a2 2 0 0 0-4 0v2",
      },
    ],
    [
      "rect",
      {
        width: "8",
        height: "5",
        x: "3",
        y: "17",
        rx: "1",
      },
    ],
  ],
};

/**
 * Creates the file-lock-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FileLock2(options) {
  return createIcon(definition, options);
}

export default FileLock2;
