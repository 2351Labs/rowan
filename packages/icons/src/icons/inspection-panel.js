import { createIcon } from "../icon.js";

const definition = {
  name: "inspection-panel",
  nodes: [
    [
      "rect",
      {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M7 7h.01",
      },
    ],
    [
      "path",
      {
        d: "M17 7h.01",
      },
    ],
    [
      "path",
      {
        d: "M7 17h.01",
      },
    ],
    [
      "path",
      {
        d: "M17 17h.01",
      },
    ],
  ],
};

/**
 * Creates the inspection-panel icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function InspectionPanel(options) {
  return createIcon(definition, options);
}

export default InspectionPanel;
