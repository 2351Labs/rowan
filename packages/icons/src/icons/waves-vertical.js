import { createIcon } from "../icon.js";

const definition = {
  name: "waves-vertical",
  nodes: [
    [
      "path",
      {
        d: "M12 2q2 2.5 0 5t0 5 0 5 0 5",
      },
    ],
    [
      "path",
      {
        d: "M19 2q2 2.5 0 5t0 5 0 5 0 5",
      },
    ],
    [
      "path",
      {
        d: "M5 2q2 2.5 0 5t0 5 0 5 0 5",
      },
    ],
  ],
};

/**
 * Creates the waves-vertical icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function WavesVertical(options) {
  return createIcon(definition, options);
}

export default WavesVertical;
