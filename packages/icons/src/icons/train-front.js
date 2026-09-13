import { createIcon } from "../icon.js";

const definition = {
  name: "train-front",
  nodes: [
    [
      "path",
      {
        d: "M8 3.1V7a4 4 0 0 0 8 0V3.1",
      },
    ],
    [
      "path",
      {
        d: "m9 15-1-1",
      },
    ],
    [
      "path",
      {
        d: "m15 15 1-1",
      },
    ],
    [
      "path",
      {
        d: "M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z",
      },
    ],
    [
      "path",
      {
        d: "m8 19-2 3",
      },
    ],
    [
      "path",
      {
        d: "m16 19 2 3",
      },
    ],
  ],
};

/**
 * Creates the train-front icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TrainFront(options) {
  return createIcon(definition, options);
}

export default TrainFront;
