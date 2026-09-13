import { createIcon } from "../icon.js";

const definition = {
  name: "unplug",
  nodes: [
    [
      "path",
      {
        d: "m19 5 3-3",
      },
    ],
    [
      "path",
      {
        d: "m2 22 3-3",
      },
    ],
    [
      "path",
      {
        d: "M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z",
      },
    ],
    [
      "path",
      {
        d: "M7.5 13.5 10 11",
      },
    ],
    [
      "path",
      {
        d: "M10.5 16.5 13 14",
      },
    ],
    [
      "path",
      {
        d: "m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z",
      },
    ],
  ],
};

/**
 * Creates the unplug icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Unplug(options) {
  return createIcon(definition, options);
}

export default Unplug;
