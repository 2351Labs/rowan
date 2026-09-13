import { createIcon } from "../icon.js";

const definition = {
  name: "workflow",
  nodes: [
    [
      "rect",
      {
        width: "8",
        height: "8",
        x: "3",
        y: "3",
        rx: "2",
      },
    ],
    [
      "path",
      {
        d: "M7 11v4a2 2 0 0 0 2 2h4",
      },
    ],
    [
      "rect",
      {
        width: "8",
        height: "8",
        x: "13",
        y: "13",
        rx: "2",
      },
    ],
  ],
};

/**
 * Creates the workflow icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Workflow(options) {
  return createIcon(definition, options);
}

export default Workflow;
