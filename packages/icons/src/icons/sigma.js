import { createIcon } from "../icon.js";

const definition = {
  name: "sigma",
  nodes: [
    [
      "path",
      {
        d: "M18 7V5a1 1 0 0 0-1-1H6.5a.5.5 0 0 0-.4.8l4.5 6a2 2 0 0 1 0 2.4l-4.5 6a.5.5 0 0 0 .4.8H17a1 1 0 0 0 1-1v-2",
      },
    ],
  ],
};

/**
 * Creates the sigma icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Sigma(options) {
  return createIcon(definition, options);
}

export default Sigma;
