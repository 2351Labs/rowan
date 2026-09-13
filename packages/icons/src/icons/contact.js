import { createIcon } from "../icon.js";

const definition = {
  name: "contact",
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
        d: "M7 21v-2a2 2 0 012-2h6a2 2 0 012 2v2",
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
        cy: "10",
        r: "3",
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
 * Creates the contact icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Contact(options) {
  return createIcon(definition, options);
}

export default Contact;
