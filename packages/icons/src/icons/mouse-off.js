import { createIcon } from "../icon.js";

const definition = {
  name: "mouse-off",
  nodes: [
    [
      "path",
      {
        d: "M12 6v.343",
      },
    ],
    [
      "path",
      {
        d: "M18.218 18.218A7 7 0 0 1 5 15V9a7 7 0 0 1 .782-3.218",
      },
    ],
    [
      "path",
      {
        d: "M19 13.343V9A7 7 0 0 0 8.56 2.902",
      },
    ],
    [
      "path",
      {
        d: "M22 22 2 2",
      },
    ],
  ],
};

/**
 * Creates the mouse-off icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MouseOff(options) {
  return createIcon(definition, options);
}

export default MouseOff;
