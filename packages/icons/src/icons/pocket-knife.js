import { createIcon } from "../icon.js";

const definition = {
  name: "pocket-knife",
  nodes: [
    [
      "path",
      {
        d: "M3 2v1c0 1 2 1 2 2S3 6 3 7s2 1 2 2-2 1-2 2 2 1 2 2",
      },
    ],
    [
      "path",
      {
        d: "M18 6h.01",
      },
    ],
    [
      "path",
      {
        d: "M6 18h.01",
      },
    ],
    [
      "path",
      {
        d: "M20.83 8.83a4 4 0 0 0-5.66-5.66l-12 12a4 4 0 1 0 5.66 5.66Z",
      },
    ],
    [
      "path",
      {
        d: "M18 11.66V22a4 4 0 0 0 4-4V6",
      },
    ],
  ],
};

/**
 * Creates the pocket-knife icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PocketKnife(options) {
  return createIcon(definition, options);
}

export default PocketKnife;
