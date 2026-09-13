import { createIcon } from "../icon.js";

const definition = {
  name: "target",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "6",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "2",
      },
    ],
  ],
};

/**
 * Creates the target icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Target(options) {
  return createIcon(definition, options);
}

export default Target;
