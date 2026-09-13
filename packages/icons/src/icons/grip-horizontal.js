import { createIcon } from "../icon.js";

const definition = {
  name: "grip-horizontal",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "9",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "19",
        cy: "9",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "5",
        cy: "9",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "15",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "19",
        cy: "15",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "5",
        cy: "15",
        r: "1",
      },
    ],
  ],
};

/**
 * Creates the grip-horizontal icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GripHorizontal(options) {
  return createIcon(definition, options);
}

export default GripHorizontal;
