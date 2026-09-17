import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanMenu as RowanMenuElement } from "../../menu/menu.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanMenu: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanMenuElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanMenuElement>
>;
