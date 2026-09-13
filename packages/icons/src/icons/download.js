import { createIcon } from "../icon.js";

const definition = {
  name: "download",
  nodes: [
    [
      "path",
      {
        d: "M12 15V3",
      },
    ],
    [
      "path",
      {
        d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
      },
    ],
    [
      "path",
      {
        d: "m7 10 5 5 5-5",
      },
    ],
  ],
};

/**
 * Creates the download icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Download(options) {
  return createIcon(definition, options);
}

export default Download;
