import { createIcon } from "../icon.js";

const definition = {
  name: "cloud-hail",
  nodes: [
    [
      "path",
      {
        d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",
      },
    ],
    [
      "path",
      {
        d: "M16 14v2",
      },
    ],
    [
      "path",
      {
        d: "M8 14v2",
      },
    ],
    [
      "path",
      {
        d: "M16 20h.01",
      },
    ],
    [
      "path",
      {
        d: "M8 20h.01",
      },
    ],
    [
      "path",
      {
        d: "M12 16v2",
      },
    ],
    [
      "path",
      {
        d: "M12 22h.01",
      },
    ],
  ],
};

/**
 * Creates the cloud-hail icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CloudHail(options) {
  return createIcon(definition, options);
}

export default CloudHail;
