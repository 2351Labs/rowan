import { createIcon } from "../icon.js";

const definition = {
  name: "towel-rack",
  nodes: [
    [
      "path",
      {
        d: "M22 7h-2",
      },
    ],
    [
      "path",
      {
        d: "M6.5 3h11A2.5 2.5 0 0 1 20 5.5V20a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V5.5a1 1 0 0 0-5 0V17a1 1 0 0 0 1 1h4",
      },
    ],
    [
      "path",
      {
        d: "M9 7H2",
      },
    ],
  ],
};

/**
 * Creates the towel-rack icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TowelRack(options) {
  return createIcon(definition, options);
}

export default TowelRack;
