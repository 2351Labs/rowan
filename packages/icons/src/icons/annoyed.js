import { createIcon } from "../icon.js";

const definition = {
  name: "annoyed",
  nodes: [
    [
      "path",
      {
        d: "M14 10h2",
      },
    ],
    [
      "path",
      {
        d: "M8 10h2",
      },
    ],
    [
      "path",
      {
        d: "M8 16h8",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
  ],
};

/**
 * Creates the annoyed icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Annoyed(options) {
  return createIcon(definition, options);
}

export default Annoyed;
