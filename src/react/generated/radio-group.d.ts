import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { RowanRadioGroup as RowanRadioGroupElement } from "../../radio-group/radio-group.js";
import type { RowanWrapperProps } from "../wrapper-props.js";

export const RowanRadioGroup: ForwardRefExoticComponent<
  RowanWrapperProps<
    RowanRadioGroupElement,
    {
      onRowanChange?: (event: CustomEvent) => void;
    }
  > &
    RefAttributes<RowanRadioGroupElement>
>;
