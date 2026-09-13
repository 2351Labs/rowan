import { createIcon } from "../icon.js";

const definition = {
  name: "power-off",
  nodes: [
    [
      "path",
      {
        d: "M18.36 6.64A9 9 0 0 1 20.77 15",
      },
    ],
    [
      "path",
      {
        d: "M6.16 6.16a9 9 0 1 0 12.68 12.68",
      },
    ],
    [
      "path",
      {
        d: "M12 2v4",
      },
    ],
    [
      "path",
      {
        d: "m2 2 20 20",
      },
    ],
  ],
};

/**
 * Creates the power-off icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PowerOff(options) {
  return createIcon(definition, options);
}

export default PowerOff;
