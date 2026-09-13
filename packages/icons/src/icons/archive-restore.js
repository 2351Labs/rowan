import { createIcon } from "../icon.js";

const definition = {
  name: "archive-restore",
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
        d: "M4 8v11a2 2 0 0 0 2 2h2",
      },
    ],
    [
      "path",
      {
        d: "M20 8v11a2 2 0 0 1-2 2h-2",
      },
    ],
    [
      "path",
      {
        d: "m9 15 3-3 3 3",
      },
    ],
    [
      "path",
      {
        d: "M12 12v9",
      },
    ],
  ],
};

/**
 * Creates the archive-restore icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ArchiveRestore(options) {
  return createIcon(definition, options);
}

export default ArchiveRestore;
