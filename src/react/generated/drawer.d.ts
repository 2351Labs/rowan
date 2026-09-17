import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanDrawer as RowanDrawerElement } from "../../drawer/drawer.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanDrawer: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanDrawerElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanDrawerElement>
>;
