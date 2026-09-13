import { createIcon } from "../icon.js";

const definition = {
  name: "ticket-minus",
  nodes: [
    [
      "path",
      {
        d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
      },
    ],
    [
      "path",
      {
        d: "M9 12h6",
      },
    ],
  ],
};

/**
 * Creates the ticket-minus icon.
 * @param {import("../icon.js").IconOptions} [options]
 * @returns {SVGSVGElement}
 */
export function TicketMinus(options) {
  return createIcon(definition, options);
}

export default TicketMinus;
