import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanCard as RowanCardElement } from "../../card/card.js";

export const RowanCard: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanCardElement>
>;
