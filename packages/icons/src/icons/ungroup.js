import { createIcon } from "../icon.js";

const definition = {
  name: "ungroup",
  nodes: [
    [
      "rect",
      {
        x: "11",
        y: "14",
        width: "10",
        height: "7",
        rx: "2",
      },
    ],
    [
      "rect",
      {
        x: "3",
        y: "3",
        width: "10",
        height: "7",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the ungroup icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Ungroup(options) {
  return createIcon(definition, options);
}

export default Ungroup;
