import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanColorPicker as RowanColorPickerElement } from "../../color-picker/color-picker.js";

export const RowanColorPicker: ForwardRefExoticComponent<
  Record<string, unknown> & RefAttributes<RowanColorPickerElement>
>;
