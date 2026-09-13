import { createIcon } from "../icon.js";

const definition = {
  name: "blend",
  nodes: [
    [
      "circle",
      {
        cx: "15",
        cy: "9",
        r: "7",
      },
    ],
    [
      "circle",
      {
        cx: "9",
        cy: "15",
        r: "7",
      },
    ],
  ],
};

/**
 * Creates the blend icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Blend(options) {
  return createIcon(definition, options);
}

export default Blend;
