import { createIcon } from "../icon.js";

const definition = {
  name: "play-off",
  nodes: [
    [
      "path",
      {
        d: "m10.215 4.56 9.79 5.71a2 2 0 0 1 .003 3.458l-.393.23",
      },
    ],
    [
      "path",
      {
        d: "m16.042 16.042-8.034 4.686A2 2 0 0 1 5 19V5",
      },
    ],
    [
      "path",
      {
        d: "m2 2 20 20",
      },
    ],
  ],
};

/**
 * Creates the play-off icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PlayOff(options) {
  return createIcon(definition, options);
}

export default PlayOff;
