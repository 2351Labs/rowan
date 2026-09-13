import { createIcon } from "../icon.js";

const definition = {
  name: "webcam",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "10",
        r: "8",
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
      "path",
      {
        d: "M7 22h10",
      },
    ],
    [
      "path",
      {
        d: "M12 22v-4",
      },
    ],
  ],
};

/**
 * Creates the webcam icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Webcam(options) {
  return createIcon(definition, options);
}

export default Webcam;
