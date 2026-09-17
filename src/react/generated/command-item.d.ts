import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanCommandItem as RowanCommandItemElement } from "../../command-item/command-item.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanCommandItem: ForwardRefExoticComponent<
  RowanWrapperProps<RowanCommandItemElement, {}> & RefAttributes<RowanCommandItemElement>
>;
