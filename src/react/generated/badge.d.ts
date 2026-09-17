import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanBadge as RowanBadgeElement } from "../../badge/badge.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanBadge: ForwardRefExoticComponent<
  RowanWrapperProps<RowanBadgeElement, {}> & RefAttributes<RowanBadgeElement>
>;
