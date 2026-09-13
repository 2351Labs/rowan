import { createIcon } from "../icon.js";

const definition = {
  name: "power",
  nodes: [
    [
      "path",
      {
        d: "M12 2v10",
      },
    ],
    [
      "path",
      {
        d: "M18.4 6.6a9 9 0 1 1-12.77.04",
      },
    ],
  ],
};

/**
 * Creates the power icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Power(options) {
  return createIcon(definition, options);
}

export default Power;
