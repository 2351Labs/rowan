import { createIcon } from "../icon.js";

const definition = {
  name: "contrast",
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
        d: "M12 18a6 6 0 0 0 0-12v12z",
      },
    ],
  ],
};

/**
 * Creates the contrast icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Contrast(options) {
  return createIcon(definition, options);
}

export default Contrast;
