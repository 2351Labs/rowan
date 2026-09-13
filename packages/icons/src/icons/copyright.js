import { createIcon } from "../icon.js";

const definition = {
  name: "copyright",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
    [
      "path",
      {
        d: "M14.83 14.83a4 4 0 1 1 0-5.66",
      },
    ],
  ],
};

/**
 * Creates the copyright icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Copyright(options) {
  return createIcon(definition, options);
}

export default Copyright;
