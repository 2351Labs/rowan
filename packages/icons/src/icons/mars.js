import { createIcon } from "../icon.js";

const definition = {
  name: "mars",
  nodes: [
    [
      "path",
      {
        d: "M16 3h5v5",
      },
    ],
    [
      "path",
      {
        d: "m21 3-6.75 6.75",
      },
    ],
    [
      "circle",
      {
        cx: "10",
        cy: "14",
        r: "6",
      },
    ],
  ],
};

/**
 * Creates the mars icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Mars(options) {
  return createIcon(definition, options);
}

export default Mars;
