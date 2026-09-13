import { createIcon } from "../icon.js";

const definition = {
  name: "building-complex-plus",
  nodes: [
    [
      "path",
      {
        d: "M10 12h4",
      },
    ],
    [
      "path",
      {
        d: "M10 21v-3a2 2 0 013.05-1.702",
      },
    ],
    [
      "path",
      {
        d: "M10 8h4",
      },
    ],
    [
      "path",
      {
        d: "M16 19h6",
      },
    ],
    [
      "path",
      {
        d: "M18 7h2a2 2 0 012 2v4.355",
      },
    ],
    [
      "path",
      {
        d: "M19 16v6",
      },
    ],
    [
      "path",
      {
        d: "M6 10H4a2 2 0 00-2 2v7a2 2 0 002 2h8.535",
      },
    ],
    [
      "path",
      {
        d: "M6 21V5a2 2 0 012-2h8a2 2 0 012 2v7.126",
      },
    ],
  ],
};

/**
 * Creates the building-complex-plus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function BuildingComplexPlus(options) {
  return createIcon(definition, options);
}

export default BuildingComplexPlus;
