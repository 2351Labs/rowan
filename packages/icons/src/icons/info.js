import { createIcon } from "../icon.js";

const definition = {
  name: "info",
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
        d: "M12 16v-4",
      },
    ],
    [
      "path",
      {
        d: "M12 8h.01",
      },
    ],
  ],
};

/**
 * Creates the info icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Info(options) {
  return createIcon(definition, options);
}

export default Info;
