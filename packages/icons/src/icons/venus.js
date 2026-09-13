import { createIcon } from "../icon.js";

const definition = {
  name: "venus",
  nodes: [
    [
      "path",
      {
        d: "M12 15v7",
      },
    ],
    [
      "path",
      {
        d: "M9 19h6",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "9",
        r: "6",
      },
    ],
  ],
};

/**
 * Creates the venus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Venus(options) {
  return createIcon(definition, options);
}

export default Venus;
