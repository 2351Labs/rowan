import { createIcon } from "../icon.js";

const definition = {
  name: "case-upper",
  nodes: [
    [
      "path",
      {
        d: "M15 11h4.5a1 1 0 0 1 0 5h-4a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h3a1 1 0 0 1 0 5",
      },
    ],
    [
      "path",
      {
        d: "m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16",
      },
    ],
    [
      "path",
      {
        d: "M3.304 13h6.392",
      },
    ],
  ],
};

/**
 * Creates the case-upper icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CaseUpper(options) {
  return createIcon(definition, options);
}

export default CaseUpper;
