import { createIcon } from "../icon.js";

const definition = {
  name: "person-standing",
  nodes: [
    [
      "circle",
      {
        cx: "12",
        cy: "5",
        r: "1",
      },
    ],
    [
      "path",
      {
        d: "m9 20 3-6 3 6",
      },
    ],
    [
      "path",
      {
        d: "m6 8 6 2 6-2",
      },
    ],
    [
      "path",
      {
        d: "M12 10v4",
      },
    ],
  ],
};

/**
 * Creates the person-standing icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function PersonStanding(options) {
  return createIcon(definition, options);
}

export default PersonStanding;
