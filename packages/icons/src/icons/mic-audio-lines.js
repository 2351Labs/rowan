import { createIcon } from "../icon.js";

const definition = {
  name: "mic-audio-lines",
  nodes: [
    [
      "path",
      {
        d: "M10 3v2.341",
      },
    ],
    [
      "path",
      {
        d: "M12 17v4",
      },
    ],
    [
      "path",
      {
        d: "M14 5v.341",
      },
    ],
    [
      "path",
      {
        d: "M18 5v13",
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
        d: "M6 6v11",
      },
    ],
    [
      "path",
      {
        d: "M9 21h6",
      },
    ],
    [
      "rect",
      {
        width: "4",
        height: "8",
        x: "10",
        y: "9",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the mic-audio-lines icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MicAudioLines(options) {
  return createIcon(definition, options);
}

export default MicAudioLines;
