import { createIcon } from "../icon.js";

const definition = {
  name: "non-binary",
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
        d: "m8.5 4 7 4",
      },
    ],
    [
      "path",
      {
        d: "m8.5 8 7-4",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "17",
        r: "5",
      },
    ],
  ],
};

/**
 * Creates the non-binary icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function NonBinary(options) {
  return createIcon(definition, options);
}

export default NonBinary;
