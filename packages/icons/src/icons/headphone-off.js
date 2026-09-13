import { createIcon } from "../icon.js";

const definition = {
  name: "headphone-off",
  nodes: [
    [
      "path",
      {
        d: "M21 14h-1.343",
      },
    ],
    [
      "path",
      {
        d: "M9.128 3.47A9 9 0 0 1 21 12v3.343",
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
        d: "M20.414 20.414A2 2 0 0 1 19 21h-1a2 2 0 0 1-2-2v-3",
      },
    ],
    [
      "path",
      {
        d: "M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 2.636-6.364",
      },
    ],
  ],
};

/**
 * Creates the headphone-off icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function HeadphoneOff(options) {
  return createIcon(definition, options);
}

export default HeadphoneOff;
