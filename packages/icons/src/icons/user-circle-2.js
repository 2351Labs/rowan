import { createIcon } from "../icon.js";

const definition = {
  name: "user-circle-2",
  nodes: [
    [
      "path",
      {
        d: "M17.925 20.056a6 6 0 0 0-11.851.001",
      },
    ],
    [
      "circle",
      {
        cx: "12",
        cy: "11",
        r: "4",
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
 * Creates the user-circle-2 icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function UserCircle2(options) {
  return createIcon(definition, options);
}

export default UserCircle2;
