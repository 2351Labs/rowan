import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanMenuItem as RowanMenuItemElement } from "../../menu-item/menu-item.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanMenuItem: ForwardRefExoticComponent<
  RowanWrapperProps<RowanMenuItemElement, {}> & RefAttributes<RowanMenuItemElement>
>;
