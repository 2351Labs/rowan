import { createIcon } from "../icon.js";

const definition = {
  name: "terminal-square",
  nodes: [
    [
      "path",
      {
        d: "m7 11 2-2-2-2",
      },
    ],
    [
      "path",
      {
        d: "M11 13h4",
      },
    ],
    [
      "rect",
      {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2",
        ry: "2",
      },
    ],
  ],
};

/**
 * Creates the terminal-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TerminalSquare(options) {
  return createIcon(definition, options);
}

export default TerminalSquare;
