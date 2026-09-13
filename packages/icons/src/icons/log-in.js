import { createIcon } from "../icon.js";

const definition = {
  name: "log-in",
  nodes: [
    [
      "path",
      {
        d: "m10 17 5-5-5-5",
      },
    ],
    [
      "path",
      {
        d: "M15 12H3",
      },
    ],
    [
      "path",
      {
        d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",
      },
    ],
  ],
};

/**
 * Creates the log-in icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function LogIn(options) {
  return createIcon(definition, options);
}

export default LogIn;
