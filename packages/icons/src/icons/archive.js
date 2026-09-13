import { createIcon } from "../icon.js";

const definition = {
  name: "archive",
  nodes: [
    [
      "rect",
      {
        width: "20",
        height: "5",
        x: "2",
        y: "3",
        rx: "1",
      },
    ],
    [
      "path",
      {
        d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8",
      },
    ],
    [
      "path",
      {
        d: "M10 12h4",
      },
    ],
  ],
};

/**
 * Creates the archive icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Archive(options) {
  return createIcon(definition, options);
}

export default Archive;
