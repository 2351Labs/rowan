import { createIcon } from "../icon.js";

const definition = {
  name: "star-half",
  nodes: [
    [
      "path",
      {
        d: "M12 18.338a2.1 2.1 0 0 0-.987.244L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16l2.309-4.679A.53.53 0 0 1 12 2",
      },
    ],
  ],
};

/**
 * Creates the star-half icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function StarHalf(options) {
  return createIcon(definition, options);
}

export default StarHalf;
