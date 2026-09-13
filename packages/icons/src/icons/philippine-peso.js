import { createIcon } from "../icon.js";

const definition = {
  name: "philippine-peso",
  nodes: [
    [
      "path",
      {
        d: "M20 11H4",
      },
    ],
    [
      "path",
      {
        d: "M20 7H4",
      },
    ],
    [
      "path",
      {
        d: "M7 21V4a1 1 0 0 1 1-1h4a1 1 0 0 1 0 12H7",
      },
    ],
  ],
};

/**
 * Creates the philippine-peso icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PhilippinePeso(options) {
  return createIcon(definition, options);
}

export default PhilippinePeso;
