import { createIcon } from "../icon.js";

const definition = {
  name: "clipboard-copy",
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
        d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",
      },
    ],
    [
      "path",
      {
        d: "M16 4h2a2 2 0 0 1 2 2v4",
      },
    ],
    [
      "path",
      {
        d: "M21 14H11",
      },
    ],
    [
      "path",
      {
        d: "m15 10-4 4 4 4",
      },
    ],
  ],
};

/**
 * Creates the clipboard-copy icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ClipboardCopy(options) {
  return createIcon(definition, options);
}

export default ClipboardCopy;
