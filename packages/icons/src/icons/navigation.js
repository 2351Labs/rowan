import { createIcon } from "../icon.js";

const definition = {
  name: "navigation",
  nodes: [
    [
      "polygon",
      {
        points: "3 11 22 2 13 21 11 13 3 11",
      },
    ],
  ],
};

/**
 * Creates the navigation icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Navigation(options) {
  return createIcon(definition, options);
}

export default Navigation;
