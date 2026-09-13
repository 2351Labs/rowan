import { createIcon } from "../icon.js";

const definition = {
  name: "asterisk",
  nodes: [
    [
      "path",
      {
        d: "M12 5v14",
      },
    ],
    [
      "path",
      {
        d: "m18.065 8.496-12.125 7",
      },
    ],
    [
      "path",
      {
        d: "m5.94 8.504 12.125 7",
      },
    ],
  ],
};

/**
 * Creates the asterisk icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Asterisk(options) {
  return createIcon(definition, options);
}

export default Asterisk;
