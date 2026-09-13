import { createIcon } from "../icon.js";

const definition = {
  name: "file-video-2",
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
        d: "m10 17.843 3.033-1.755a.64.64 0 0 1 .967.56v4.704a.65.65 0 0 1-.967.56L10 20.157",
      },
    ],
    [
      "rect",
      {
        width: "7",
        height: "6",
        x: "3",
        y: "16",
        rx: "1",
      },
    ],
  ],
};

/**
 * Creates the file-video-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FileVideo2(options) {
  return createIcon(definition, options);
}

export default FileVideo2;
