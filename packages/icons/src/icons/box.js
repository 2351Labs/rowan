import { createIcon } from "../icon.js";

const definition = {
  name: "box",
  nodes: [
    [
      "path",
      {
        d: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
      },
    ],
    [
      "path",
      {
        d: "m3.3 7 8.7 5 8.7-5",
      },
    ],
    [
      "path",
      {
        d: "M12 22V12",
      },
    ],
  ],
};

/**
 * Creates the box icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Box(options) {
  return createIcon(definition, options);
}

export default Box;
