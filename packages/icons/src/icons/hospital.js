import { createIcon } from "../icon.js";

const definition = {
  name: "hospital",
  nodes: [
    [
      "path",
      {
        d: "M12 7v4",
      },
    ],
    [
      "path",
      {
        d: "M14 21v-3a2 2 0 0 0-4 0v3",
      },
    ],
    [
      "path",
      {
        d: "M14 9h-4",
      },
    ],
    [
      "path",
      {
        d: "M18 11h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2",
      },
    ],
    [
      "path",
      {
        d: "M18 21V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16",
      },
    ],
  ],
};

/**
 * Creates the hospital icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function Hospital(options) {
  return createIcon(definition, options);
}

export default Hospital;
