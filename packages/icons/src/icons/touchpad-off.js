import { createIcon } from "../icon.js";

const definition = {
  name: "touchpad-off",
  nodes: [
    [
      "path",
      {
        d: "M12 20v-6",
      },
    ],
    [
      "path",
      {
        d: "M19.656 14H22",
      },
    ],
    [
      "path",
      {
        d: "M2 14h12",
      },
    ],
    [
      "path",
      {
        d: "m2 2 20 20",
      },
    ],
    [
      "path",
      {
        d: "M20 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2",
      },
    ],
    [
      "path",
      {
        d: "M9.656 4H20a2 2 0 0 1 2 2v10.344",
      },
    ],
  ],
};

/**
 * Creates the touchpad-off icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TouchpadOff(options) {
  return createIcon(definition, options);
}

export default TouchpadOff;
