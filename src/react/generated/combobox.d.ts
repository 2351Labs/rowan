import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanCombobox as RowanComboboxElement } from "../../combobox/combobox.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanCombobox: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanComboboxElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanComboboxElement>
>;
