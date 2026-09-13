import { createIcon } from "../icon.js";

const definition = {
  name: "kanban",
  nodes: [
    [
      "path",
      {
        d: "M5 3v14",
      },
    ],
    [
      "path",
      {
        d: "M12 3v8",
      },
    ],
    [
      "path",
      {
        d: "M19 3v18",
      },
    ],
  ],
};

/**
 * Creates the kanban icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Kanban(options) {
  return createIcon(definition, options);
}

export default Kanban;
