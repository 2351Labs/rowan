import { createIcon } from "../icon.js";

const definition = {
  name: "cloud-check",
  nodes: [
    [
      "path",
      {
        d: "m17 15-5.5 5.5L9 18",
      },
    ],
    [
      "path",
      {
        d: "M5.516 16.07A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 3.501 7.327",
      },
    ],
  ],
};

/**
 * Creates the cloud-check icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CloudCheck(options) {
  return createIcon(definition, options);
}

export default CloudCheck;
