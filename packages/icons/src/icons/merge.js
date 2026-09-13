import { createIcon } from "../icon.js";

const definition = {
  name: "merge",
  nodes: [
    [
      "path",
      {
        d: "m8 6 4-4 4 4",
      },
    ],
    [
      "path",
      {
        d: "M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22",
      },
    ],
    [
      "path",
      {
        d: "m20 22-5-5",
      },
    ],
  ],
};

/**
 * Creates the merge icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Merge(options) {
  return createIcon(definition, options);
}

export default Merge;
