import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanSideNavItem as RowanSideNavItemElement } from "../../side-nav-item/side-nav-item.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanSideNavItem: ForwardRefExoticComponent<
  RowanWrapperProps<RowanSideNavItemElement, {}> & RefAttributes<RowanSideNavItemElement>
>;
