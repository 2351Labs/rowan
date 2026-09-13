import { createIcon } from "../icon.js";

const definition = {
  name: "cloud-lightning",
  nodes: [
    [
      "path",
      {
        d: "M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973",
      },
    ],
    [
      "path",
      {
        d: "m13 12-3 5h4l-3 5",
      },
    ],
  ],
};

/**
 * Creates the cloud-lightning icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CloudLightning(options) {
  return createIcon(definition, options);
}

export default CloudLightning;
