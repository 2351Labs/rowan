import { createIcon } from "../icon.js";

const definition = {
  name: "crop",
  nodes: [
    [
      "path",
      {
        d: "M6 2v14a2 2 0 0 0 2 2h14",
      },
    ],
    [
      "path",
      {
        d: "M18 22V8a2 2 0 0 0-2-2H2",
      },
    ],
  ],
};

/**
 * Creates the crop icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Crop(options) {
  return createIcon(definition, options);
}

export default Crop;
