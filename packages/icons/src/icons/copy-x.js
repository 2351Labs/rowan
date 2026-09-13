import { createIcon } from "../icon.js";

const definition = {
  name: "copy-x",
  nodes: [
    [
      "path",
      {
        d: "M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2",
      },
    ],
    [
      "rect",
      {
        x: "8",
        y: "8",
        width: "14",
        height: "14",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "m12.5 12.5 5 5",
      },
    ],
    [
      "path",
      {
        d: "m12.5 17.5 5-5",
      },
    ],
  ],
};

/**
 * Creates the copy-x icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CopyX(options) {
  return createIcon(definition, options);
}

export default CopyX;
