import { createIcon } from "../icon.js";

const definition = {
  name: "upload",
  nodes: [
    [
      "path",
      {
        d: "M12 3v12",
      },
    ],
    [
      "path",
      {
        d: "m17 8-5-5-5 5",
      },
    ],
    [
      "path",
      {
        d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
      },
    ],
  ],
};

/**
 * Creates the upload icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Upload(options) {
  return createIcon(definition, options);
}

export default Upload;
