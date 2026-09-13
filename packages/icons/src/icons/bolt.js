import { createIcon } from "../icon.js";

const definition = {
  name: "bolt",
  nodes: [
    [
      "path",
      {
        d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "4",
      },
    ],
  ],
};

/**
 * Creates the bolt icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Bolt(options) {
  return createIcon(definition, options);
}

export default Bolt;
