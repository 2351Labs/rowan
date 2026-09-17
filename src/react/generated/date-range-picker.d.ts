import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanDateRangePicker as RowanDateRangePickerElement } from "../../date-range-picker/date-range-picker.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanDateRangePicker: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanDateRangePickerElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanDateRangePickerElement>
>;
