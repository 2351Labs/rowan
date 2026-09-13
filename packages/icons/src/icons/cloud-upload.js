import { createIcon } from "../icon.js";

const definition = {
  name: "cloud-upload",
  nodes: [
    [
      "path",
      {
        d: "M12 13v8",
      },
    ],
    [
      "path",
      {
        d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",
      },
    ],
    [
      "path",
      {
        d: "m8 17 4-4 4 4",
      },
    ],
  ],
};

/**
 * Creates the cloud-upload icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CloudUpload(options) {
  return createIcon(definition, options);
}

export default CloudUpload;
