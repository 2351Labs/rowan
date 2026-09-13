import { createIcon } from "../icon.js";

const definition = {
  name: "globe",
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
        d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",
      },
    ],
    [
      "path",
      {
        d: "M2 12h20",
      },
    ],
  ],
};

/**
 * Creates the globe icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Globe(options) {
  return createIcon(definition, options);
}

export default Globe;
