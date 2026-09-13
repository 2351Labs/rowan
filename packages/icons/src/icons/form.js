import { createIcon } from "../icon.js";

const definition = {
  name: "form",
  nodes: [
    [
      "path",
      {
        d: "M4 14h6",
      },
    ],
    [
      "path",
      {
        d: "M4 2h10",
      },
    ],
    [
      "rect",
      {
        x: "4",
        y: "18",
        width: "16",
        height: "4",
        rx: "1",
      },
    ],
    [
      "rect",
      {
        x: "4",
        y: "6",
        width: "16",
        height: "4",
        rx: "1",
      },
    ],
  ],
};

/**
 * Creates the form icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Form(options) {
  return createIcon(definition, options);
}

export default Form;
