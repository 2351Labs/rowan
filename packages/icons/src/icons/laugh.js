import { createIcon } from "../icon.js";

const definition = {
  name: "laugh",
  nodes: [
    [
      "path",
      {
        d: "M15 10V9",
      },
    ],
    [
      "path",
      {
        d: "M7.084 14.302a5.12 5.12 0 009.833 0 .24.24 0 00-.235-.302H7.32a.24.24 0 00-.235.302",
      },
    ],
    [
      "path",
      {
        d: "M9 10V9",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10",
      },
    ],
  ],
};

/**
 * Creates the laugh icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Laugh(options) {
  return createIcon(definition, options);
}

export default Laugh;
