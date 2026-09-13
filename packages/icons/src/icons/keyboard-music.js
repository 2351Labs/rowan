import { createIcon } from "../icon.js";

const definition = {
  name: "keyboard-music",
  nodes: [
    [
      "rect",
      {
        width: "20",
        height: "16",
        x: "2",
        y: "4",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M6 8h4",
      },
    ],
    [
      "path",
      {
        d: "M14 8h.01",
      },
    ],
    [
      "path",
      {
        d: "M18 8h.01",
      },
    ],
    [
      "path",
      {
        d: "M2 12h20",
      },
    ],
    [
      "path",
      {
        d: "M6 12v4",
      },
    ],
    [
      "path",
      {
        d: "M10 12v4",
      },
    ],
    [
      "path",
      {
        d: "M14 12v4",
      },
    ],
    [
      "path",
      {
        d: "M18 12v4",
      },
    ],
  ],
};

/**
 * Creates the keyboard-music icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function KeyboardMusic(options) {
  return createIcon(definition, options);
}

export default KeyboardMusic;
