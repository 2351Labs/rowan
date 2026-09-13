import { createIcon } from "../icon.js";

const definition = {
  name: "coins",
  nodes: [
    [
      "path",
      {
        d: "M13.744 17.736a6 6 0 1 1-7.48-7.48",
      },
    ],
    [
      "path",
      {
        d: "M15 6h1v4",
      },
    ],
    [
      "path",
      {
        d: "m6.134 14.768.866-.5 2 3.464",
      },
    ],
    [
      "circle",
      {
        cx: "16",
        cy: "8",
        r: "6",
      },
    ],
  ],
};

/**
 * Creates the coins icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Coins(options) {
  return createIcon(definition, options);
}

export default Coins;
