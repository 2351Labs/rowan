import { createIcon } from "../icon.js";

const definition = {
  name: "signpost",
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
        d: "M12 3v3",
      },
    ],
    [
      "path",
      {
        d: "M2.354 10.354a1.207 1.207 0 0 1 0-1.708l2.06-2.06A2 2 0 0 1 5.828 6h12.344a2 2 0 0 1 1.414.586l2.06 2.06a1.207 1.207 0 0 1 0 1.708l-2.06 2.06a2 2 0 0 1-1.414.586H5.828a2 2 0 0 1-1.414-.586z",
      },
    ],
  ],
};

/**
 * Creates the signpost icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Signpost(options) {
  return createIcon(definition, options);
}

export default Signpost;
