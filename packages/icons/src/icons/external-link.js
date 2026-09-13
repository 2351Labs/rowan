import { createIcon } from "../icon.js";

const definition = {
  name: "external-link",
  nodes: [
    [
      "path",
      {
        d: "M15 3h6v6",
      },
    ],
    [
      "path",
      {
        d: "M10 14 21 3",
      },
    ],
    [
      "path",
      {
        d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
      },
    ],
  ],
};

/**
 * Creates the external-link icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ExternalLink(options) {
  return createIcon(definition, options);
}

export default ExternalLink;
