import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanDatePicker as RowanDatePickerElement } from "../../date-picker/date-picker.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanDatePicker: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanDatePickerElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanDatePickerElement>
>;
