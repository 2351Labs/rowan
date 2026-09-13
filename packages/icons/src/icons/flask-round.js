import { createIcon } from "../icon.js";

const definition = {
  name: "flask-round",
  nodes: [
    [
      "path",
      {
        d: "M10 2v6.292a7 7 0 1 0 4 0V2",
      },
    ],
    [
      "path",
      {
        d: "M5 15h14",
      },
    ],
    [
      "path",
      {
        d: "M8.5 2h7",
      },
    ],
  ],
};

/**
 * Creates the flask-round icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function FlaskRound(options) {
  return createIcon(definition, options);
}

export default FlaskRound;
