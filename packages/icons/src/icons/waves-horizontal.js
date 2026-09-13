import { createIcon } from "../icon.js";

const definition = {
  name: "waves-horizontal",
  nodes: [
    [
      "path",
      {
        d: "M2 12q2.5 2 5 0t5 0 5 0 5 0",
      },
    ],
    [
      "path",
      {
        d: "M2 19q2.5 2 5 0t5 0 5 0 5 0",
      },
    ],
    [
      "path",
      {
        d: "M2 5q2.5 2 5 0t5 0 5 0 5 0",
      },
    ],
  ],
};

/**
 * Creates the waves-horizontal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function WavesHorizontal(options) {
  return createIcon(definition, options);
}

export default WavesHorizontal;
