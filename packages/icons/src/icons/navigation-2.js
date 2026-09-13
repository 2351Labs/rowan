import { createIcon } from "../icon.js";

const definition = {
  name: "navigation-2",
  nodes: [
    [
      "polygon",
      {
        points: "12 2 19 21 12 17 5 21 12 2",
      },
    ],
  ],
};

/**
 * Creates the navigation-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Navigation2(options) {
  return createIcon(definition, options);
}

export default Navigation2;
