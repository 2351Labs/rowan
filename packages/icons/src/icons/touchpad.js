import { createIcon } from "../icon.js";

const definition = {
  name: "touchpad",
  nodes: [
    [
      "rect",
      {
        width: "20",
        height: "16",
        x: "2",
        y: "4",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M2 14h20",
      },
    ],
    [
      "path",
      {
        d: "M12 20v-6",
      },
    ],
  ],
};

/**
 * Creates the touchpad icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Touchpad(options) {
  return createIcon(definition, options);
}

export default Touchpad;
