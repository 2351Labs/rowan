import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanMultiSelectCombobox as RowanMultiSelectComboboxElement } from "../../multi-select-combobox/multi-select-combobox.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanMultiSelectCombobox: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanMultiSelectComboboxElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanMultiSelectComboboxElement>
>;
