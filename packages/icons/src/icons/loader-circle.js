import { createIcon } from "../icon.js";

const definition = {
  name: "loader-circle",
  nodes: [
    [
      "path",
      {
        d: "M21 12a9 9 0 1 1-6.219-8.56",
      },
    ],
  ],
};

/**
 * Creates the loader-circle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function LoaderCircle(options) {
  return createIcon(definition, options);
}

export default LoaderCircle;
