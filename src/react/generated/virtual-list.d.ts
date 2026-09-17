import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanVirtualList as RowanVirtualListElement } from "../../virtual-list/virtual-list.js";

export const RowanVirtualList: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanVirtualListElement>
>;
