import { createIcon } from "../icon.js";

const definition = {
  name: "egg",
  nodes: [
    [
      "path",
      {
        d: "M12 2C8 2 4 8 4 14a8 8 0 0 0 16 0c0-6-4-12-8-12",
      },
    ],
  ],
};

/**
 * Creates the egg icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Egg(options) {
  return createIcon(definition, options);
}

export default Egg;
