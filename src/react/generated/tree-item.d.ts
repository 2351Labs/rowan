import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanTreeItem as RowanTreeItemElement } from "../../tree-item/tree-item.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanTreeItem: ForwardRefExoticComponent<
  RowanWrapperProps<RowanTreeItemElement, {}> & RefAttributes<RowanTreeItemElement>
>;
