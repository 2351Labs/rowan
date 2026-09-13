import { createIcon } from "../icon.js";

const definition = {
  name: "parasol",
  nodes: [
    [
      "path",
      {
        d: "M12.5 11.134 18.196 21",
      },
    ],
    [
      "path",
      {
        d: "M20.425 5.299a10 10 0 0 0-16.941 9.78c.183.563.843.774 1.355.478L20.16 6.711c.512-.296.66-.973.264-1.413",
      },
    ],
    [
      "path",
      {
        d: "M21 21H3",
      },
    ],
  ],
};

/**
 * Creates the parasol icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Parasol(options) {
  return createIcon(definition, options);
}

export default Parasol;
