import { createIcon } from "../icon.js";

const definition = {
  name: "list-restart",
  nodes: [
    [
      "path",
      {
        d: "M21 5H3",
      },
    ],
    [
      "path",
      {
        d: "M7 12H3",
      },
    ],
    [
      "path",
      {
        d: "M7 19H3",
      },
    ],
    [
      "path",
      {
        d: "M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14",
      },
    ],
    [
      "path",
      {
        d: "M11 10v4h4",
      },
    ],
  ],
};

/**
 * Creates the list-restart icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ListRestart(options) {
  return createIcon(definition, options);
}

export default ListRestart;
