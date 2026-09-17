import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanTimePicker as RowanTimePickerElement } from "../../time-picker/time-picker.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanTimePicker: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanTimePickerElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanTimePickerElement>
>;
