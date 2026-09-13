import { createIcon } from "../icon.js";

const definition = {
  name: "heart-x",
  nodes: [
    [
      "path",
      {
        d: "m15.5 12.5 5 5",
      },
    ],
    [
      "path",
      {
        d: "m20.5 12.5-5 5",
      },
    ],
    [
      "path",
      {
        d: "M21.955 8.774a5.5 5.5 0 0 0-9.546-2.95.6.6 0 0 1-.818 0A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.508 5.332a2 2 0 0 0 2.57.352",
      },
    ],
  ],
};

/**
 * Creates the heart-x icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function HeartX(options) {
  return createIcon(definition, options);
}

export default HeartX;
