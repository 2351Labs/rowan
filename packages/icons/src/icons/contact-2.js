import { createIcon } from "../icon.js";

const definition = {
  name: "contact-2",
  nodes: [
    [
      "path",
      {
        d: "M16 2v2",
      },
    ],
    [
      "path",
      {
        d: "M17.915 21a6 6 0 10-12 0",
      },
    ],
    [
      "path",
      {
        d: "M8 2v2",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "11",
        r: "4",
      },
    ],
    [
      "rect",
      {
        x: "3",
        y: "3",
        width: "18",
        height: "18",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the contact-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Contact2(options) {
  return createIcon(definition, options);
}

export default Contact2;
