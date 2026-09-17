import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanContextMenu as RowanContextMenuElement } from "../../context-menu/context-menu.js";

export const RowanContextMenu: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanContextMenuElement>
>;
