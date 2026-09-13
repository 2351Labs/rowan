import { createIcon } from "../icon.js";

const definition = {
  name: "switch-camera",
  nodes: [
    [
      "path",
      {
        d: "M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5",
      },
    ],
    [
      "path",
      {
        d: "M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "3",
      },
    ],
    [
      "path",
      {
        d: "m18 22-3-3 3-3",
      },
    ],
    [
      "path",
      {
        d: "m6 2 3 3-3 3",
      },
    ],
  ],
};

/**
 * Creates the switch-camera icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function SwitchCamera(options) {
  return createIcon(definition, options);
}

export default SwitchCamera;
