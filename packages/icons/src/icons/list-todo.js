import { createIcon } from "../icon.js";

const definition = {
  name: "list-todo",
  nodes: [
    [
      "path",
      {
        d: "M13 5h8",
      },
    ],
    [
      "path",
      {
        d: "M13 12h8",
      },
    ],
    [
      "path",
      {
        d: "M13 19h8",
      },
    ],
    [
      "path",
      {
        d: "m3 17 2 2 4-4",
      },
    ],
    [
      "rect",
      {
        x: "3",
        y: "4",
        width: "6",
        height: "6",
        rx: "1",
      },
    ],
  ],
};

/**
 * Creates the list-todo icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function ListTodo(options) {
  return createIcon(definition, options);
}

export default ListTodo;
