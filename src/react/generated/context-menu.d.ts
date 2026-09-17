import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanContextMenu as RowanContextMenuElement } from "../../context-menu/context-menu.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanContextMenu: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanContextMenuElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
      onRowanClose?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanContextMenuElement>
>;
