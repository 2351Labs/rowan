import { createIcon } from "../icon.js";

const definition = {
  name: "bike",
  nodes: [
    [
      "circle",
      {
        cx: "18.5",
        cy: "17.5",
        r: "3.5",
      },
    ],
    [
      "circle",
      {
        cx: "5.5",
        cy: "17.5",
        r: "3.5",
      },
    ],
    [
      "circle",
      {
        cx: "15",
        cy: "5",
        r: "1",
      },
    ],
    [
      "path",
      {
        d: "M12 17.5V14l-3-3 4-3 2 3h2",
      },
    ],
  ],
};

/**
 * Creates the bike icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Bike(options) {
  return createIcon(definition, options);
}

export default Bike;
