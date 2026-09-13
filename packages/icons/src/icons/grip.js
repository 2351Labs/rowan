import { createIcon } from "../icon.js";

const definition = {
  name: "grip",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "5",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "19",
        cy: "5",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "5",
        cy: "5",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "19",
        cy: "12",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "5",
        cy: "12",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "19",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "19",
        cy: "19",
        r: "1",
      },
    ],
    [
      "circle",
      {
        cx: "5",
        cy: "19",
        r: "1",
      },
    ],
  ],
};

/**
 * Creates the grip icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Grip(options) {
  return createIcon(definition, options);
}

export default Grip;
