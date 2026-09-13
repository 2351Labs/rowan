import { createIcon } from "../icon.js";

const definition = {
  name: "terminal",
  nodes: [
    [
      "path",
      {
        d: "M12 19h8",
      },
    ],
    [
      "path",
      {
        d: "m4 17 6-6-6-6",
      },
    ],
  ],
};

/**
 * Creates the terminal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Terminal(options) {
  return createIcon(definition, options);
}

export default Terminal;
