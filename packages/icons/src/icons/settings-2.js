import { createIcon } from "../icon.js";

const definition = {
  name: "settings-2",
  nodes: [
    [
      "path",
      {
        d: "M14 17H5",
      },
    ],
    [
      "path",
      {
        d: "M19 7h-9",
      },
    ],
    [
      "circle",
      {
        cx: "17",
        cy: "17",
        r: "3",
      },
    ],
    [
      "circle",
      {
        cx: "7",
        cy: "7",
        r: "3",
      },
    ],
  ],
};

/**
 * Creates the settings-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Settings2(options) {
  return createIcon(definition, options);
}

export default Settings2;
