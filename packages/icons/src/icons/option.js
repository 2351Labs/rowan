import { createIcon } from "../icon.js";

const definition = {
  name: "option",
  nodes: [
    [
      "path",
      {
        d: "M14 3h7",
      },
    ],
    [
      "path",
      {
        d: "M3 3h5.28a1 1 0 0 1 .948.684l5.544 16.632a1 1 0 0 0 .949.684H21",
      },
    ],
  ],
};

/**
 * Creates the option icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Option(options) {
  return createIcon(definition, options);
}

export default Option;
