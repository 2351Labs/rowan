import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanCheckbox as RowanCheckboxElement } from "../../checkbox/checkbox.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanCheckbox: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanCheckboxElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanCheckboxElement>
>;
