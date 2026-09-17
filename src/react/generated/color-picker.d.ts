import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanColorPicker as RowanColorPickerElement } from "../../color-picker/color-picker.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanColorPicker: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanColorPickerElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanColorPickerElement>
>;
