import { createIcon } from "../icon.js";

const definition = {
  name: "case-sensitive",
  nodes: [
    [
      "path",
      {
        d: "m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16",
      },
    ],
    [
      "path",
      {
        d: "M22 9v7",
      },
    ],
    [
      "path",
      {
        d: "M3.304 13h6.392",
      },
    ],
    [
      "circle",
      {
        cx: "18.5",
        cy: "12.5",
        r: "3.5",
      },
    ],
  ],
};

/**
 * Creates the case-sensitive icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CaseSensitive(options) {
  return createIcon(definition, options);
}

export default CaseSensitive;
