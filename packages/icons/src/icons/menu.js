import { createIcon } from "../icon.js";

const definition = {
  name: "menu",
  nodes: [
    [
      "path",
      {
        d: "M4 5h16",
      },
    ],
    [
      "path",
      {
        d: "M4 12h16",
      },
    ],
    [
      "path",
      {
        d: "M4 19h16",
      },
    ],
  ],
};

/**
 * Creates the menu icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Menu(options) {
  return createIcon(definition, options);
}

export default Menu;
