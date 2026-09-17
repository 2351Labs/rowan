import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanTooltip as RowanTooltipElement } from "../../tooltip/tooltip.js";

export const RowanTooltip: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanTooltipElement>
>;
