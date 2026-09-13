import { createIcon } from "../icon.js";

const definition = {
  name: "lasso",
  nodes: [
    [
      "path",
      {
        d: "M3.704 14.467a10 8 0 1 1 3.115 2.375",
      },
    ],
    [
      "path",
      {
        d: "M7 22a5 5 0 0 1-2-3.994",
      },
    ],
    [
      "circle",
      {
        cx: "5",
        cy: "16",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the lasso icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Lasso(options) {
  return createIcon(definition, options);
}

export default Lasso;
