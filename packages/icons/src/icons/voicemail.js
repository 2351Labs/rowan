import { createIcon } from "../icon.js";

const definition = {
  name: "voicemail",
  nodes: [
    [
      "circle",
      {
        cx: "6",
        cy: "12",
        r: "4",
      },
    ],
    [
      "circle",
      {
        cx: "18",
        cy: "12",
        r: "4",
      },
    ],
    [
      "line",
      {
        x1: "6",
        x2: "18",
        y1: "16",
        y2: "16",
      },
    ],
  ],
};

/**
 * Creates the voicemail icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Voicemail(options) {
  return createIcon(definition, options);
}

export default Voicemail;
