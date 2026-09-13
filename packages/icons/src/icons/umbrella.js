import { createIcon } from "../icon.js";

const definition = {
  name: "umbrella",
  nodes: [
    [
      "path",
      {
        d: "M12 13v7a2 2 0 0 0 4 0",
      },
    ],
    [
      "path",
      {
        d: "M12 2v2",
      },
    ],
    [
      "path",
      {
        d: "M20.992 13a1 1 0 0 0 .97-1.274 10.284 10.284 0 0 0-19.923 0A1 1 0 0 0 3 13z",
      },
    ],
  ],
};

/**
 * Creates the umbrella icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Umbrella(options) {
  return createIcon(definition, options);
}

export default Umbrella;
