import { createIcon } from "../icon.js";

const definition = {
  name: "case-lower",
  nodes: [
    [
      "path",
      {
        d: "M10 9v7",
      },
    ],
    [
      "path",
      {
        d: "M14 6v10",
      },
    ],
    [
      "circle",
      {
        cx: "17.5",
        cy: "12.5",
        r: "3.5",
      },
    ],
    [
      "circle",
      {
        cx: "6.5",
        cy: "12.5",
        r: "3.5",
      },
    ],
  ],
};

/**
 * Creates the case-lower icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CaseLower(options) {
  return createIcon(definition, options);
}

export default CaseLower;
