import { createIcon } from "../icon.js";

const definition = {
  name: "train-track",
  nodes: [
    [
      "path",
      {
        d: "M2 17 17 2",
      },
    ],
    [
      "path",
      {
        d: "m2 14 8 8",
      },
    ],
    [
      "path",
      {
        d: "m5 11 8 8",
      },
    ],
    [
      "path",
      {
        d: "m8 8 8 8",
      },
    ],
    [
      "path",
      {
        d: "m11 5 8 8",
      },
    ],
    [
      "path",
      {
        d: "m14 2 8 8",
      },
    ],
    [
      "path",
      {
        d: "M7 22 22 7",
      },
    ],
  ],
};

/**
 * Creates the train-track icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TrainTrack(options) {
  return createIcon(definition, options);
}

export default TrainTrack;
