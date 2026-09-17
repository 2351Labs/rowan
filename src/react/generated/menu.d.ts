import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanMenu as RowanMenuElement } from "../../menu/menu.js";

export const RowanMenu: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanMenuElement>
>;
