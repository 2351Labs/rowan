import { createIcon } from "../icon.js";

const definition = {
  name: "grip-vertical",
  nodes: [
    [
      "circle",
      {
        cx: "9",
        cy: "12",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "9",
        cy: "5",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "9",
        cy: "19",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "15",
        cy: "12",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "15",
        cy: "5",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "15",
        cy: "19",
        r: "1",
      },
    ],
  ],
};

/**
 * Creates the grip-vertical icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function GripVertical(options) {
  return createIcon(definition, options);
}

export default GripVertical;
