import { createIcon } from "../icon.js";

const definition = {
  name: "cloud-fog",
  nodes: [
    [
      "path",
      {
        d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",
      },
    ],
    [
      "path",
      {
        d: "M16 17H7",
      },
    ],
    [
      "path",
      {
        d: "M17 21H9",
      },
    ],
  ],
};

/**
 * Creates the cloud-fog icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CloudFog(options) {
  return createIcon(definition, options);
}

export default CloudFog;
