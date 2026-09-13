import { createIcon } from "../icon.js";

const definition = {
  name: "tablet-smartphone",
  nodes: [
    [
      "rect",
      {
        width: "10",
        height: "14",
        x: "3",
        y: "8",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4",
      },
    ],
    [
      "path",
      {
        d: "M8 18h.01",
      },
    ],
  ],
};

/**
 * Creates the tablet-smartphone icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TabletSmartphone(options) {
  return createIcon(definition, options);
}

export default TabletSmartphone;
