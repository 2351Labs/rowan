import { createIcon } from "../icon.js";

const definition = {
  name: "archive-x",
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
        d: "m9.5 17 5-5",
      },
    ],
    [
      "path",
      {
        d: "m9.5 12 5 5",
      },
    ],
  ],
};

/**
 * Creates the archive-x icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArchiveX(options) {
  return createIcon(definition, options);
}

export default ArchiveX;
