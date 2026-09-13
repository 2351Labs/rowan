import { createIcon } from "../icon.js";

const definition = {
  name: "download-cloud",
  nodes: [
    [
      "path",
      {
        d: "M12 13v8l-4-4",
      },
    ],
    [
      "path",
      {
        d: "m12 21 4-4",
      },
    ],
    [
      "path",
      {
        d: "M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284",
      },
    ],
  ],
};

/**
 * Creates the download-cloud icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function DownloadCloud(options) {
  return createIcon(definition, options);
}

export default DownloadCloud;
