import { createIcon } from "../icon.js";

const definition = {
  name: "slash",
  nodes: [
    [
      "path",
      {
        d: "M22 2 2 22",
      },
    ],
  ],
};

/**
 * Creates the slash icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Slash(options) {
  return createIcon(definition, options);
}

export default Slash;
