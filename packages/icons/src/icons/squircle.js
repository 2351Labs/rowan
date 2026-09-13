import { createIcon } from "../icon.js";

const definition = {
  name: "squircle",
  nodes: [
    [
      "path",
      {
        d: "M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9",
      },
    ],
  ],
};

/**
 * Creates the squircle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Squircle(options) {
  return createIcon(definition, options);
}

export default Squircle;
