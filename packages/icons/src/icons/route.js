import { createIcon } from "../icon.js";

const definition = {
  name: "route",
  nodes: [
    [
      "circle",
      {
        cx: "6",
        cy: "19",
        r: "3",
      },
    ],
    [
      "path",
      {
        d: "M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15",
      },
    ],
    [
      "circle",
      {
        cx: "18",
        cy: "5",
        r: "3",
      },
    ],
  ],
};

/**
 * Creates the route icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Route(options) {
  return createIcon(definition, options);
}

export default Route;
