import { createIcon } from "../icon.js";

const definition = {
  name: "audio-lines-x",
  nodes: [
    [
      "path",
      {
        d: "M10 3v18",
      },
    ],
    [
      "path",
      {
        d: "M14 8v6.35",
      },
    ],
    [
      "path",
      {
        d: "m17 17 5 5",
      },
    ],
    [
      "path",
      {
        d: "M18 5v8.1",
      },
    ],
    [
      "path",
      {
        d: "M2 10v3",
      },
    ],
    [
      "path",
      {
        d: "M22 10v3",
      },
    ],
    [
      "path",
      {
        d: "m22 17-5 5",
      },
    ],
    [
      "path",
      {
        d: "M6 6v11",
      },
    ],
  ],
};

/**
 * Creates the audio-lines-x icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AudioLinesX(options) {
  return createIcon(definition, options);
}

export default AudioLinesX;
