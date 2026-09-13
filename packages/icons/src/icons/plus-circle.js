import { createIcon } from "../icon.js";

const definition = {
  name: "plus-circle",
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
      "path",
      {
        d: "M8 12h8",
      },
    ],
    [
      "path",
      {
        d: "M12 8v8",
      },
    ],
  ],
};

/**
 * Creates the plus-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PlusCircle(options) {
  return createIcon(definition, options);
}

export default PlusCircle;
