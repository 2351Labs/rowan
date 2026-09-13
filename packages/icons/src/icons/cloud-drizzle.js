import { createIcon } from "../icon.js";

const definition = {
  name: "cloud-drizzle",
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
        d: "M8 19v1",
      },
    ],
    [
      "path",
      {
        d: "M8 14v1",
      },
    ],
    [
      "path",
      {
        d: "M16 19v1",
      },
    ],
    [
      "path",
      {
        d: "M16 14v1",
      },
    ],
    [
      "path",
      {
        d: "M12 21v1",
      },
    ],
    [
      "path",
      {
        d: "M12 16v1",
      },
    ],
  ],
};

/**
 * Creates the cloud-drizzle icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function CloudDrizzle(options) {
  return createIcon(definition, options);
}

export default CloudDrizzle;
