import { createIcon } from "../icon.js";

const definition = {
  name: "clipboard-type",
  nodes: [
    [
      "rect",
      {
        width: "8",
        height: "4",
        x: "8",
        y: "2",
        rx: "1",
        ry: "1",
      },
    ],
    [
      "path",
      {
        d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      },
    ],
    [
      "path",
      {
        d: "M9 12v-1h6v1",
      },
    ],
    [
      "path",
      {
        d: "M11 17h2",
      },
    ],
    [
      "path",
      {
        d: "M12 11v6",
      },
    ],
  ],
};

/**
 * Creates the clipboard-type icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ClipboardType(options) {
  return createIcon(definition, options);
}

export default ClipboardType;
