import { createIcon } from "../icon.js";

const definition = {
  name: "mail-open",
  nodes: [
    [
      "path",
      {
        d: "M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z",
      },
    ],
    [
      "path",
      {
        d: "m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10",
      },
    ],
  ],
};

/**
 * Creates the mail-open icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function MailOpen(options) {
  return createIcon(definition, options);
}

export default MailOpen;
