import { createIcon } from "../icon.js";

const definition = {
  name: "share",
  nodes: [
    [
      "path",
      {
        d: "M12 2v13",
      },
    ],
    [
      "path",
      {
        d: "m16 6-4-4-4 4",
      },
    ],
    [
      "path",
      {
        d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8",
      },
    ],
  ],
};

/**
 * Creates the share icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Share(options) {
  return createIcon(definition, options);
}

export default Share;
