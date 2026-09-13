import { createIcon } from "../icon.js";

const definition = {
  name: "flame-kindling",
  nodes: [
    [
      "path",
      {
        d: "M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10a5 5 0 1 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C8 4.5 11 2 12 2Z",
      },
    ],
    [
      "path",
      {
        d: "m5 22 14-4",
      },
    ],
    [
      "path",
      {
        d: "m5 18 14 4",
      },
    ],
  ],
};

/**
 * Creates the flame-kindling icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FlameKindling(options) {
  return createIcon(definition, options);
}

export default FlameKindling;
