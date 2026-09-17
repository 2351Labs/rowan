import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanMenuItem as RowanMenuItemElement } from "../../menu-item/menu-item.js";

export const RowanMenuItem: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanMenuItemElement>
>;
