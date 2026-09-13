import { createIcon } from "../icon.js";

const definition = {
  name: "at-sign",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "4",
      },
    ],
    [
      "path",
      {
        d: "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8",
      },
    ],
  ],
};

/**
 * Creates the at-sign icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function AtSign(options) {
  return createIcon(definition, options);
}

export default AtSign;
