import { createIcon } from "../icon.js";

const definition = {
  name: "thermometer",
  nodes: [
    [
      "path",
      {
        d: "M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z",
      },
    ],
  ],
};

/**
 * Creates the thermometer icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Thermometer(options) {
  return createIcon(definition, options);
}

export default Thermometer;
