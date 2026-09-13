import { createIcon } from "../icon.js";

const definition = {
  name: "pill",
  nodes: [
    [
      "path",
      {
        d: "m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z",
      },
    ],
    [
      "path",
      {
        d: "m8.5 8.5 7 7",
      },
    ],
  ],
};

/**
 * Creates the pill icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Pill(options) {
  return createIcon(definition, options);
}

export default Pill;
