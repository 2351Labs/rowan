import { createIcon } from "../icon.js";

const definition = {
  name: "saudi-riyal",
  nodes: [
    [
      "path",
      {
        d: "m20 19.5-5.5 1.2",
      },
    ],
    [
      "path",
      {
        d: "M14.5 4v11.22a1 1 0 0 0 1.242.97L20 15.2",
      },
    ],
    [
      "path",
      {
        d: "m2.978 19.351 5.549-1.363A2 2 0 0 0 10 16V2",
      },
    ],
    [
      "path",
      {
        d: "M20 10 4 13.5",
      },
    ],
  ],
};

/**
 * Creates the saudi-riyal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SaudiRiyal(options) {
  return createIcon(definition, options);
}

export default SaudiRiyal;
