import { createIcon } from "../icon.js";

const definition = {
  name: "mars-stroke",
  nodes: [
    [
      "path",
      {
        d: "m14 6 4 4",
      },
    ],
    [
      "path",
      {
        d: "M17 3h4v4",
      },
    ],
    [
      "path",
      {
        d: "m21 3-7.75 7.75",
      },
    ],
    [
      "circle",
      {
        cx: "9",
        cy: "15",
        r: "6",
      },
    ],
  ],
};

/**
 * Creates the mars-stroke icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MarsStroke(options) {
  return createIcon(definition, options);
}

export default MarsStroke;
