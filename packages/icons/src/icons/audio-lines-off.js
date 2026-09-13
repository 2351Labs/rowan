import { createIcon } from "../icon.js";

const definition = {
  name: "audio-lines-off",
  nodes: [
    [
      "path",
      {
        d: "M10 10v11",
      },
    ],
    [
      "path",
      {
        d: "M10 3v1.35",
      },
    ],
    [
      "path",
      {
        d: "M14 14v1",
      },
    ],
    [
      "path",
      {
        d: "M14 8v.35",
      },
    ],
    [
      "path",
      {
        d: "M18 5v7.35",
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
        d: "m2 2 20 20",
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
        d: "M6 6v11",
      },
    ],
  ],
};

/**
 * Creates the audio-lines-off icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AudioLinesOff(options) {
  return createIcon(definition, options);
}

export default AudioLinesOff;
