import { createIcon } from "../icon.js";

const definition = {
  name: "hand-helping",
  nodes: [
    [
      "path",
      {
        d: "M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14",
      },
    ],
    [
      "path",
      {
        d: "m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9",
      },
    ],
    [
      "path",
      {
        d: "m2 13 6 6",
      },
    ],
  ],
};

/**
 * Creates the hand-helping icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function HandHelping(options) {
  return createIcon(definition, options);
}

export default HandHelping;
