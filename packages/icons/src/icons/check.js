import { createIcon } from "../icon.js";

const definition = {
  name: "check",
  nodes: [
    [
      "path",
      {
        d: "M20 6 9 17l-5-5",
      },
    ],
  ],
};

/**
 * Creates the check icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Check(options) {
  return createIcon(definition, options);
}

export default Check;
