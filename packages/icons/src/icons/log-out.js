import { createIcon } from "../icon.js";

const definition = {
  name: "log-out",
  nodes: [
    [
      "path",
      {
        d: "m16 17 5-5-5-5",
      },
    ],
    [
      "path",
      {
        d: "M21 12H9",
      },
    ],
    [
      "path",
      {
        d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
      },
    ],
  ],
};

/**
 * Creates the log-out icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function LogOut(options) {
  return createIcon(definition, options);
}

export default LogOut;
