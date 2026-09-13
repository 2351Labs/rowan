import { createIcon } from "../icon.js";

const definition = {
  name: "audio-waveform",
  nodes: [
    [
      "path",
      {
        d: "M2 13a2 2 0 0 0 2-2V7a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0V4a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0v-4a2 2 0 0 1 2-2",
      },
    ],
  ],
};

/**
 * Creates the audio-waveform icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AudioWaveform(options) {
  return createIcon(definition, options);
}

export default AudioWaveform;
