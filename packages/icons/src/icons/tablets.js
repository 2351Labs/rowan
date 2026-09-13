import { createIcon } from "../icon.js";

const definition = {
  name: "tablets",
  nodes: [
    [
      "circle",
      {
        cx: "7",
        cy: "7",
        r: "5",
      },
    ],
    [
      "circle",
      {
        cx: "17",
        cy: "17",
        r: "5",
      },
    ],
    [
      "path",
      {
        d: "M12 17h10",
      },
    ],
    [
      "path",
      {
        d: "m3.46 10.54 7.08-7.08",
      },
    ],
  ],
};

/**
 * Creates the tablets icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Tablets(options) {
  return createIcon(definition, options);
}

export default Tablets;
