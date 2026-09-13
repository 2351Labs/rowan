import { createIcon } from "../icon.js";

const definition = {
  name: "droplet",
  nodes: [
    [
      "path",
      {
        d: "M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z",
      },
    ],
  ],
};

/**
 * Creates the droplet icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Droplet(options) {
  return createIcon(definition, options);
}

export default Droplet;
