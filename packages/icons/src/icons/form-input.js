import { createIcon } from "../icon.js";

const definition = {
  name: "form-input",
  nodes: [
    [
      "rect",
      {
        width: "20",
        height: "12",
        x: "2",
        y: "6",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M12 12h.01",
      },
    ],
    [
      "path",
      {
        d: "M17 12h.01",
      },
    ],
    [
      "path",
      {
        d: "M7 12h.01",
      },
    ],
  ],
};

/**
 * Creates the form-input icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FormInput(options) {
  return createIcon(definition, options);
}

export default FormInput;
