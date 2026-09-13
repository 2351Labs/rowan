import { createIcon } from "../icon.js";

const definition = {
  name: "cloud-off",
  nodes: [
    [
      "path",
      {
        d: "M10.94 5.274A7 7 0 0 1 15.71 10h1.79a4.5 4.5 0 0 1 4.222 6.057",
      },
    ],
    [
      "path",
      {
        d: "M18.796 18.81A4.5 4.5 0 0 1 17.5 19H9A7 7 0 0 1 5.79 5.78",
      },
    ],
    [
      "path",
      {
        d: "m2 2 20 20",
      },
    ],
  ],
};

/**
 * Creates the cloud-off icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CloudOff(options) {
  return createIcon(definition, options);
}

export default CloudOff;
