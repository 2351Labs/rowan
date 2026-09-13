import { createIcon } from "../icon.js";

const definition = {
  name: "space",
  nodes: [
    [
      "path",
      {
        d: "M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1",
      },
    ],
  ],
};

/**
 * Creates the space icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Space(options) {
  return createIcon(definition, options);
}

export default Space;
