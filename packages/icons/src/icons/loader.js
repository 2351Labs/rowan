import { createIcon } from "../icon.js";

const definition = {
  name: "loader",
  nodes: [
    [
      "path",
      {
        d: "M12 2v4",
      },
    ],
    [
      "path",
      {
        d: "m16.2 7.8 2.9-2.9",
      },
    ],
    [
      "path",
      {
        d: "M18 12h4",
      },
    ],
    [
      "path",
      {
        d: "m16.2 16.2 2.9 2.9",
      },
    ],
    [
      "path",
      {
        d: "M12 18v4",
      },
    ],
    [
      "path",
      {
        d: "m4.9 19.1 2.9-2.9",
      },
    ],
    [
      "path",
      {
        d: "M2 12h4",
      },
    ],
    [
      "path",
      {
        d: "m4.9 4.9 2.9 2.9",
      },
    ],
  ],
};

/**
 * Creates the loader icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Loader(options) {
  return createIcon(definition, options);
}

export default Loader;
