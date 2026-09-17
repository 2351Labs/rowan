import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanTooltip as RowanTooltipElement } from "../../tooltip/tooltip.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanTooltip: ForwardRefExoticComponent<
  RowanWrapperProps<RowanTooltipElement, {}> & RefAttributes<RowanTooltipElement>
>;
