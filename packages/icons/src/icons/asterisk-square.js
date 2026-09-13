import { createIcon } from "../icon.js";

const definition = {
  name: "asterisk-square",
  nodes: [
    [
      "rect",
      {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M12 8v8",
      },
    ],
    [
      "path",
      {
        d: "m8.5 14 7-4",
      },
    ],
    [
      "path",
      {
        d: "m8.5 10 7 4",
      },
    ],
  ],
};

/**
 * Creates the asterisk-square icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AsteriskSquare(options) {
  return createIcon(definition, options);
}

export default AsteriskSquare;
