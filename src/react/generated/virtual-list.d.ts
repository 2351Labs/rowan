import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanVirtualList as RowanVirtualListElement } from "../../virtual-list/virtual-list.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanVirtualList: ForwardRefExoticComponent<
  RowanWrapperProps<RowanVirtualListElement, {}> & RefAttributes<RowanVirtualListElement>
>;
