import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanTreeItem as RowanTreeItemElement } from "../../tree-item/tree-item.js";

export const RowanTreeItem: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanTreeItemElement>
>;
