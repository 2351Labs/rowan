import { createIcon } from "../icon.js";

const definition = {
  name: "notepad-text",
  nodes: [
    [
      "path",
      {
        d: "M8 2v4",
      },
    ],
    [
      "path",
      {
        d: "M12 2v4",
      },
    ],
    [
      "path",
      {
        d: "M16 2v4",
      },
    ],
    [
      "rect",
      {
        width: "16",
        height: "18",
        x: "4",
        y: "4",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M8 10h6",
      },
    ],
    [
      "path",
      {
        d: "M8 14h8",
      },
    ],
    [
      "path",
      {
        d: "M8 18h5",
      },
    ],
  ],
};

/**
 * Creates the notepad-text icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function NotepadText(options) {
  return createIcon(definition, options);
}

export default NotepadText;
