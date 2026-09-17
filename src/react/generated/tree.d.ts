import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanTree as RowanTreeElement } from "../../tree/tree.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanTree: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanTreeElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
      onRowanToggle?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanTreeElement>
>;
