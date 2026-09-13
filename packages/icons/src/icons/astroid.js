import { createIcon } from "../icon.js";

const definition = {
  name: "astroid",
  nodes: [
    [
      "path",
      {
        d: "M12.983 21.186a1 1 0 0 1-1.966 0 10 10 0 0 0-8.203-8.203 1 1 0 0 1 0-1.966 10 10 0 0 0 8.203-8.203 1 1 0 0 1 1.966 0 10 10 0 0 0 8.203 8.203 1 1 0 0 1 0 1.966 10 10 0 0 0-8.203 8.203",
      },
    ],
  ],
};

/**
 * Creates the astroid icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Astroid(options) {
  return createIcon(definition, options);
}

export default Astroid;
